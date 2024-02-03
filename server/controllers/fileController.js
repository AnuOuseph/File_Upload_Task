const path = require('path');
const fs = require('fs');
const shortid = require('shortid');


  const fileUpload = async (req, res) => {
    try {
        console.log('Uploaded File:', req.body.file);

        // Extract necessary data from the request
        const fileContent = req.body.file;
        const userId = req.body.id;

        // Function to create a folder if it doesn't exist
        const createFolder = (folderPath) => {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
                console.log(`Folder created: ${folderPath}`);
            } else {
                console.log(`Folder already exists: ${folderPath}`);
            }
        };

        // Define the base folder and user-specific folder paths
        const baseFolder = 'uploads';
        const userFolder = path.join(baseFolder, userId);

        // Create base folder and user-specific folder
        createFolder(baseFolder);
        createFolder(userFolder);

        // Generate a unique code for the file name
        const uniqueCode = shortid.generate().toUpperCase().substring(0, 6);

        // Extract the original file name from the file path
        const fileName = path.basename(fileContent);

        // Create the updated file name with the unique code
        const updatedFileName = `${uniqueCode}_${fileName}`;

        // Create the full path for the updated file
        const updatedFilePath = path.join(userFolder, updatedFileName);

        // Write the file content to the updated file path (you can modify this part)
        fs.writeFileSync(updatedFilePath, 'File content goes here');

        return res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
  }
  const getFiles = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userFolder = path.join('uploads', userId);

        // Check if the user-specific folder exists
        if (fs.existsSync(userFolder)) {
            // Read the files in the user folder
            const files = fs.readdirSync(userFolder);

            // Send the list of files in the response
            return res.status(200).json({ files });
        } else {
            return res.status(404).json({ message: 'User folder not found' });
        }

    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const removeFiles = async (req, res) => {
    try {
        const userId = req.params.userId;
        const fileName = req.params.fileName;
        const userFolder = path.join('uploads', userId);
        const filePath = path.join(userFolder, fileName);

        // Check if the user-specific folder exists
        if (fs.existsSync(userFolder)) {
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                // Remove the file
                fs.unlinkSync(filePath);
                return res.status(200).json({ message: 'File removed successfully' });
            } else {
                return res.status(404).json({ message: 'File not found' });
            }
        } else {
            return res.status(404).json({ message: 'User folder not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  


module.exports = {fileUpload, getFiles,removeFiles}