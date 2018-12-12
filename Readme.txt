Topic: Analysis of CDC Neonatal data for 2017

CDC Source Data: https://www.cdc.gov/nchs/data_access/vitalstatsonline.htm

Preprocessing of the CDC data must be done to generate JSON files which are used by the D3 code.  This is performed via the preprocess_data.py python script included in this bundle.  This script reads the fixed-width-format data file from the CDC and constructs a pandas dataframe which is then utilized to create the various relations that will be visualized and exports that data to individual json files to be used for each visualization.

Once the individual json files are constructed, they will need to be populated into the `data` folder within the `www` folder.  This `www` folder will then need to be hosted for web delivery.  Once ready, the `index.html` can be loaded into a web-browser to view the analysis.
