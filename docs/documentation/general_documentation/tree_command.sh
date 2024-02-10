#!/bin/bash

# Shows only the folders, ignores some specific folders that have a lot in them,not created by me 

# tree -d ../../../ -I 'app_venv|node_modules|_static|_build|_templates|__pycache__'
tree -d . -I 'app_venv|node_modules|_static|_build|_templates|__pycache__'

