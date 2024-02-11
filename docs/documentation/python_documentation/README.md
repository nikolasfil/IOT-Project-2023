
## tree python_documentation

```
python_documentation/
├── command.sh
├── files_keeping
│   ├── command.sh
│   ├── conf.py
│   ├── conf.py.bak2
│   ├── index.rst
│   ├── Makefile
│   └── README.md
├── README.md
└── sphinx_documentation
    ├── broker.rst
    ├── button_sensor.rst
    ├── conf.py
    ├── connector_server.rst
    ├── context_provider.rst
    ├── index.rst
    ├── Makefile
    ├── modules.rst
    ├── publisher_broker.rst
    ├── sensor_context_provider.rst
    ├── subscriber_broker.rst
    ├── tracker_sensor.rst
    └── virtual_sensor.rst

3 directories, 21 files
```



## Sphinx Documentation

After activating the venv 

```bash
cd python_servers
source app_venv/bin/activate
```

### Installation

```bash
pip install sphinx
```


### Documentation

Run the command and fill out the necessary information about the project 

```bash
sphinx-quickstart
```

Run the command specifying where the files are for the sphinx to identify

```bash
sphinx-apidoc -o . /home/figaro/Programms/Github_Projects/NikolasProjects/IOT-Project-2023/python_servers/src/
```

Edit the conf.py

```bash
vim conf.py
```

```python
# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import os
from pathlib import Path
import sys

# -- Path setup --------------------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#path-setup

# sys.path.insert(0, os.path.abspath("../../src"))
parent = Path(__file__).parent
parent = parent.parent
parent = parent.parent
parent = parent.parent
parent = parent.parent
src_folder = Path(parent, "python_servers", "src")
sys.path.insert(0, os.path.abspath(str(src_folder)))

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "IOT"
copyright = "2024, nikolasfil"
author = "nikolasfil"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx.ext.autodoc",
    # "sphinx_rtd_dark_mode",
]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "alabaster"
html_static_path = ["_static"]

```

Lastly Run the make command to start the process.

```bash
make clean html
```


### View


To view it simply run a python server insided the python_documentation

```bash
python -m http.server 8080
```

and go to the [url](http://localhost:8080/_build/html/)


### Resources

[yt-tutorial](https://www.youtube.com/watch?v=5s3JvVqwESA)

