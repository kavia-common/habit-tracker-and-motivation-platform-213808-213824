#!/bin/bash
cd /home/kavia/workspace/code-generation/habit-tracker-and-motivation-platform-213808-213824/habithive_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

