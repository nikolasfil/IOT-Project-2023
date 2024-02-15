
##  Index for obsidian

```dataview 
TABLE
rows.file.link
FROM "UNI/Semester-9/IOT/project/project_doc_l/documentation"
where file.name!=this.file.name
group by split(file.folder,"UNI/Semester-9/IOT/project/project_doc_l/documentation/")[1] as Folder
```


## Tree Representations : 


### calls_documentation

```
calls_documentation/
├── all-call-graphs.md
├── all-call-graphs.pdf
├── all-file-trees.md
├── docs-file-tree.md
├── file_tree.md
├── index-general_documentation.md
├── node-database-call-graph.md
├── node-database-server-file-tree.md
├── node-servers-file-tree.md
├── node-website-call-graph.md
├── node-website-file-tree.md
├── node-website-file-tree.pdf
├── node-website-hbs-call-graph.md
├── project_tree.md
├── python-servers-file-tree.md
└── tree_command.sh

1 directory, 16 files
```

### python_documentation 

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

