# File Encryption and Decryption Web Application

This project is a web-based application for encrypting and decrypting files using the cryptography library. The application allows users to upload files, encrypt them with a password, and store them securely in Backblaze B2 Cloud Storage. Users can also retrieve and decrypt the files using the correct password.

## Table of Contents

1. [Features](#features)
2. [Requirements](#requirements)
3. [Setup](#setup)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- *File Encryption*: Securely encrypt files using password-based encryption.
- *Cloud Storage*: Upload encrypted files to Backblaze B2 Cloud Storage.
- *File Decryption*: Retrieve and decrypt files with the correct password.
- *Secure Password Handling*: Generates a strong encryption key from user-provided passwords.
- *Error Handling*: Provides feedback on errors such as incorrect passwords or missing files.

## Requirements

- Python 3.x
- Flask
- Cryptography library
- Backblaze B2 SDK for Python (b2sdk)
- python-dotenv (for loading environment variables)

## Setup

1. *Clone the Repository*:

   ```bash
   git clone https://github.com/ManojAcharya08