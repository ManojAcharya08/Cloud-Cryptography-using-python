from flask import Flask, render_template, request, flash, redirect, url_for, send_file, session
from cryptography.fernet import Fernet, InvalidToken
import io
import base64
import hashlib
import os
import b2sdk.v2 as b2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'default_secret_key')  # Provide default for testing

# Backblaze B2 settings
B2_APPLICATION_KEY_ID = os.getenv('B2_APPLICATION_KEY_ID')
B2_APPLICATION_KEY = os.getenv('B2_APPLICATION_KEY')
B2_BUCKET_NAME = os.getenv('B2_BUCKET_NAME')

# Initialize Backblaze B2
info = b2.InMemoryAccountInfo()
b2_api = b2.B2Api(info)
b2_api.authorize_account("production", B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY)
bucket = b2_api.get_bucket_by_name(B2_BUCKET_NAME)

# Fixed salt for debugging purposes (ensure 16 bytes)
FIXED_SALT = b'some_fixed_salt_1234'

def generate_key(password):
    """Generate a secure key using PBKDF2 with a fixed salt."""
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), FIXED_SALT, 100000)
    key = key[:32]  # Fernet key must be 32 bytes long
    return base64.urlsafe_b64encode(key)

def calculate_file_hash(file_data):
    """Calculate the SHA-256 hash of the file data."""
    sha256_hash = hashlib.sha256(file_data).hexdigest()
    return sha256_hash

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/encrypt-upload', methods=['GET', 'POST'])
def encrypt_upload():
    if request.method == 'POST':
        file = request.files.get('file')
        password = request.form.get('password')
        
        if not file or not password:
            flash('File and password are required!', 'error')
            return redirect(url_for('home'))
        
        key = generate_key(password)
        fernet = Fernet(key)
        file_name = file.filename
        
        try:
            file_data = file.read()
            original_hash = calculate_file_hash(file_data)
            session['original_hash'] = original_hash

            encrypted_data = fernet.encrypt(file_data)
            bucket.upload_bytes(encrypted_data, file_name, content_type='application/octet-stream')
            flash(f'File {file_name} encrypted and uploaded successfully!', 'success')
            
        except Exception as e:
            flash(f'Operation failed: {e}', 'error')
        
        return redirect(url_for('home'))

@app.route('/decrypt-retrieve', methods=['GET', 'POST'])
def decrypt_retrieve():
    if request.method == 'POST':
        file_name = request.form.get('file_name')
        password = request.form.get('password')
        
        if not file_name or not password:
            flash('Filename and password are required!', 'error')
            return redirect(url_for('home'))
        
        key = generate_key(password)
        fernet = Fernet(key)
        
        try:
            download_file = bucket.download_file_by_name(file_name)
            buffer = io.BytesIO()
            download_file.save(buffer)
            buffer.seek(0)
            encrypted_data = buffer.read()

            try:
                decrypted_data = fernet.decrypt(encrypted_data)
                decrypted_file = io.BytesIO(decrypted_data)
                decrypted_file.seek(0)
                
                decrypted_hash = calculate_file_hash(decrypted_data)
                original_hash = session.get('original_hash', None)

                if original_hash and decrypted_hash == original_hash:
                    flash('File decrypted successfully with correct data.', 'success')
                else:
                    flash('File decrypted but data does not match original.', 'error')
                
                return send_file(
                    decrypted_file,
                    as_attachment=True,
                    download_name=f'decrypted_{file_name}'
                )
            except InvalidToken:
                flash('Decryption failed: Invalid password or corrupted data.', 'error')
        
        except b2.exception.FileNotPresent as e:
            flash(f'File not found: {e}', 'error')
        except b2.exception.B2Error as e:
            flash(f'Failed to download file from Backblaze B2: {e}', 'error')
        except Exception as e:
            flash(f'Operation failed: {e}', 'error')

        # Redirect to main page after decryption operation
        return redirect(url_for('home'))

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)