#!/bin/bash
echo "📤 Inizio procedura di push per ꪶ ⌬ ꫂ | ʙᴏᴛ..."

# 1. Pulizia file sensibili e temporanei
rm -rf sessione
rm -rf auth_info_baileys
rm -rf .npm

# 2. Configurazione .gitignore (se non esiste)
if [ ! -f .gitignore ]; then
    echo "node_modules
sessione
auth_info_baileys
database.json
.npm
package-lock.json" > .gitignore
    echo "✅ .gitignore creato."
fi

# 3. Git Workflow
git add .
git commit -m "🚀 OMNI BOT: Custom Pairing O3NI8OTT & Turbo-Handler Fix"

# 4. Push
echo "🚀 Caricamento su GitHub..."
git push

echo "✅ Operazione completata, Mr. Kiwi!"
