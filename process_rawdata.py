#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Nov 19 20:06:02 2018

@author: jimgrund
"""

import os
### Provide the path here
os.chdir('/Users/jimgrund/Documents/GWU/DATS6401-DataViz/final/') 
colspecs=[[8,12], [12,14], [74,76], [76,78], [78,79], [107,109], [119,120], [123,124], [162,163], [223,225],
          [226,227],[237,239],[241,243],[250,251],
          [252,254],[254,256],[256,258],[258,260],
          [260,261],[261,262],[262,263],[263,264],
          [282,286],[286,287],[303,305],[305,306],
          [312,313],[313,314],[314,315],[315,316],[316,317],
          [324,325],[325,326],
          [342,343],[343,344],[344,345],[345,346],[346,347],
          [382,383],[383,384],[384,385],[385,386],[386,387],[387,388],[388,389],
          [443,445],[445,446],
          [447,449],[449,450],
          [474,475],
          [493,494],
          [503,507],[508,510]]
colnames=['birth_year', 'birth_month', 'mother_age', 'mother_age_recode14', 'mother_age_recode9', 'mother_race_recode15', 'marital_status', 'mother_education','father_education','month_prenatal_began',
          'month_prenatal_began_recode', 'num_prenatal_visits', 'num_prenatal_visits_recode', 'wic',
          'cigs_before_pregnancy', 'cigs_first_trimester', 'cigs_second_trimester', 'cigs_third_trimester',
          'cigs_before_pregnancy_recode', 'cigs_first_trimester_recode', 'cigs_second_trimester_recode', 'cigs_third_trimester_recode'
          'mother_bmi', 'mother_bmi_recode', 'weight_gain', 'weight_gain_recode',
          'prepreg_diabetes','gestational_diabetes','prepreg_hypertension','gestational_hypertension','hypertension_eclampsia',
          'infertility_treatment','fertility_enhancing_drugs',
          'gonorrhea','syphillis','chlamydia','hep_b','hep_c',
          'induction','augmentation','steroids','antibiotics','chorioamnionitis','anesthesia',
          'five_min_apgar','five_min_apgar_recode',
          'ten_min_apgar','ten_min_apgar_recode',
          'infant_sex',
          'gestation_recode',
          'infant_weight','birth_weight_recode12']

### Basic Packages
import pandas as pd
#import numpy as np

## DataLoad and Global Filtering

### read in the 2009 survey data from CSV 
prenatal_df  = pd.read_fwf('Nat2017PublicUS.c20180516.r20180808.txt', colspecs=colspecs, names=colnames, header=None, converters={col:str for col in colnames})
