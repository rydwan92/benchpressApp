import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'appData.json');

export const getAppData = async (req, res) => {
  try {
    let data;
    try {
      const content = await fs.readFile(DATA_FILE, 'utf8');
      data = JSON.parse(content);
    } catch (err) {
      // Jeżeli plik nie istnieje, zwracamy domyślny stan
      data = {
        zawody: {},
        kategorie: [],
        zawodnicy: []
      };
    }
    res.json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).json({ message: 'Error reading data file' });
  }
};

export const saveAppData = async (req, res) => {
  try {
    const data = req.body;
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error saving data file:', error);
    res.status(500).json({ message: 'Error saving data file' });
  }
};