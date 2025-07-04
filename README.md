# AWP-H

Scan WordPress plugins for vulnerability patterns using regex in a web-based interface.

## Before run the tools
Put all plugins (zip) to `be/plugins/`

## Run the tools
1. Start Flask/API
``` bash
cd be
python3 app.py
```

2. Install Frontend Package & Start Frontend
```bash
cd fe
npm i
npm run dev
```

3.  Access here `http://localhost:5173/`