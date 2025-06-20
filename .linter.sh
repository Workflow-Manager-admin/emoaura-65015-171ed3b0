#!/bin/bash
cd /home/kavia/workspace/code-generation/emoaura-65015-171ed3b0/emoaura_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

