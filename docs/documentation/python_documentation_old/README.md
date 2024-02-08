---
date: 2024-02-04
subject: IOT
type:
---

After activating the venv

```bash
cd python_servers
source app_venv/bin/activate
```

## Installation

```bash
pip install sphinx
```

## Documentation

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

Also change the index.rst file to include the modules

```rst
.. IOT documentation master file, created by
   sphinx-quickstart on Sun Feb  4 01:48:02 2024.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to IOT's documentation!
===============================

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

Modules
=======

.. include:: modules.rst
```

Lastly Run the make command to start the process.

```bash
make clean html
```

## View

To view it simply run a python server insided the python_documentation

```bash
python -m http.server 8080
```

and go to the [url](http://localhost:8080/_build/html/)

## Resources

[yt-tutorial](https://www.youtube.com/watch?v=5s3JvVqwESA)
