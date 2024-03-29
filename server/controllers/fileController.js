const path = require('path');
const fs = require('fs');
const shortid = require('shortid');


  const fileUpload = async (req, res) => {
    try {

        const fileContent = req.body.file;
        const userId = req.body.id;

        const createFolder = (folderPath) => {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
                console.log(`Folder created: ${folderPath}`);
            } else {
                console.log(`Folder already exists: ${folderPath}`);
            }
        };

        const baseFolder = 'uploads';
        const userFolder = path.join(baseFolder, userId);

        createFolder(baseFolder);
        createFolder(userFolder);

        const uniqueCode = shortid.generate().toUpperCase().substring(0, 6);

        const fileName = fileContent

        const updatedFileName = `${uniqueCode}_${fileName}`;

        const updatedFilePath = path.join(userFolder, updatedFileName);

        fs.writeFileSync(updatedFilePath, 'File content goes here');

        return res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    } 
  }
  
  const getFiles = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userFolder = path.join('uploads', userId);

        if (fs.existsSync(userFolder)) {
            const files = fs.readdirSync(userFolder);
            return res.status(200).json({ files });
        } else {
            return res.status(404).json({ message: 'User folder not found' });
        }
    }catch(error){
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const removeFiles = async (req, res) => {
    try {
        const userId = req.params.userId;
        const fileName = req.params.fileName;
        const userFolder = path.join('uploads', userId);
        const filePath = path.join(userFolder, fileName);

        if (fs.existsSync(userFolder)) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return res.status(200).json({ message: 'File removed successfully' });
            } else {
                return res.status(404).json({ message: 'File not found' });
            }
        } else {
            return res.status(404).json({ message: 'User folder not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  const downloadFile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const uniqueCode = req.params.uniqueCode;
        const fileName = req.params.fileName;
        const userFolder = path.join('uploads', userId);
        const filePath = path.join(userFolder, fileName);

        if (fs.existsSync(userFolder)) {
            if (fs.existsSync(filePath)) {
                const storedUniqueCode = fileName.split('_')[0];
                if (uniqueCode === storedUniqueCode) {
                    const pathFile = path.join(__dirname,"..", 'uploads', userId, fileName);
                    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                    res.setHeader('Content-Type', 'application/octet-stream');
                    const fileUrl = fs.readFileSync(pathFile);
                    res.end(fileUrl);
                } else {
                    return res.status(403).json({ message: 'Invalid unique code' });
                }
            } else {
                return res.status(404).json({ message: 'File not found' });
            }
        } else {
            return res.status(404).json({ message: 'User folder not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }


module.exports = {fileUpload, getFiles,removeFiles, downloadFile}