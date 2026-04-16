import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
    execute: async (conn, m, from, args) => {
        await conn.sendMessage(from, { text: '⏳ Funzione sticker in fase di fix...' }, { quoted: m });
    }
}
