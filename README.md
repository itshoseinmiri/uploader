# React File Uploader Component

A customizable React file uploader component built with `react-dropzone` and `axios`.  
Supports drag-and-drop and file browsing with upload progress, file type and size validation, retry, and delete functionality.

---

## Features

- Drag & drop or browse files to upload
- File type and maximum file size validation
- Displays upload progress
- Shows upload status: Uploading, Completed, or Failed
- Retry upload on failure
- Delete uploaded files (makes DELETE request to server)
- Customizable accepted formats and max file size
- Uses `axios` for file upload HTTP requests

---

## Installation

Make sure you have React and the following dependencies installed:

```bash
npm install react react-dom react-dropzone axios