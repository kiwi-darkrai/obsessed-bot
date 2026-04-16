import fs from 'fs';
import path from 'path';

const pluginsDir = './plugins';

const migrate = () => {
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));

    files.forEach(file => {
        const filePath = path.join(pluginsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Trasforma i require comuni in import
        // Cerca pattern come: const axios = require('axios')
        content = content.replace(/const\s+(\w+)\s+=\s+require\(['"](.+?)['"]\)/g, 'import $1 from "$2"');
        
        // 2. Cambia module.exports in export default
        if (content.includes('module.exports =')) {
            content = content.replace('module.exports =', 'export default');
        }

        // 3. Fix parametri funzione execute (da sock/mek a conn/m)
        content = content.replace(/execute:\s?async\s?\((sock|socket|sock),?\s?(mek|msg|m)?/g, 'execute: async (conn, m');
        
        // 4. Sostituisce le chiamate interne al corpo
        content = content.replace(/\bsock\./g, 'conn.');
        content = content.replace(/\bmek\b/g, 'm');

        // 5. Rimuove eventuali "use strict" che possono dare fastidio in ESM
        content = content.replace(/['"]use strict['"];?/g, '');

        fs.writeFileSync(filePath, content);
        console.log(`✅ Migrato con successo: ${file}`);
    });

    console.log('\n✨ Tutti i plugin sono stati convertiti in ES Modules!');
};

migrate();

