const express = require('express');
const cors = require('cors');
const cassandra = require('cassandra-driver');
const { Long } = require('cassandra-driver').types;
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'pokemon_keyspace',
});

app.get('/api/pokemon', async (req, res) => {
  try {
    const query = 'SELECT * FROM pokemon_table';
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/pokemon', async (req, res) => {
    const { id, name, type1, type2, nom } = req.body;  // Ajoutez 'nom' à la déstructuration

    if (!id || !name || !type1) {
        return res.status(400).json({ error: 'Les champs id, name et type1 sont requis.' });
    }

    try {
        await client.execute(
            'INSERT INTO pokemon_table (id, name, type1, type2, nom) VALUES (?, ?, ?, ?, ?)',
            [id, name, type1, type2, nom], {prepare : true}  // Ajoutez 'nom' ici
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de l\'insertion/mise à jour :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


app.listen(port, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${port}`);
});
