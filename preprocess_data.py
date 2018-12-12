#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Nov 19 20:06:02 2018

@author: jimgrund
"""

import os
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np


### Provide the path here
os.chdir('/Users/jimgrund/Documents/GWU/DATS6401-DataViz/final/') 
colspecs=[[8,12], [12,14], [74,76], [76,78], [78,79], [107,109], [119,120], [123,124], [162,163], [223,225],
          [226,227],[237,239],[241,243],[250,251],
          [252,254],[254,256],[256,258],[258,260],
          [260,261],[261,262],[262,263],[263,264],
          [282,286],[286,287],[303,305],[305,306],
          [503,507],[508,510],
          [443,445],[445,446],
          [447,449],[449,450],
          [312,313],[313,314],[314,315],[315,316],[316,317],
          [324,325],[325,326],
          [342,343],[343,344],[344,345],[345,346],[346,347],
          [382,383],[383,384],[384,385],[385,386],[386,387],[387,388],

          [474,475],
          [493,494]]
colnames=['birth_year', 'birth_month', 'mother_age', 'mother_age_recode14', 'mother_age_recode9', 'mother_race_recode15', 'marital_status', 'mother_education','father_education','month_prenatal_began',
          'month_prenatal_began_recode', 'num_prenatal_visits', 'num_prenatal_visits_recode', 'wic',
          'cigs_before_pregnancy', 'cigs_first_trimester', 'cigs_second_trimester', 'cigs_third_trimester',
          'cigs_before_pregnancy_recode', 'cigs_first_trimester_recode', 'cigs_second_trimester_recode', 'cigs_third_trimester_recode',
          'mother_bmi', 'mother_bmi_recode', 'weight_gain', 'weight_gain_recode',
          'infant_weight','birth_weight_recode12',
          'five_min_apgar','five_min_apgar_recode',
          'ten_min_apgar','ten_min_apgar_recode',
          'prepreg_diabetes','gestational_diabetes','prepreg_hypertension','gestational_hypertension','hypertension_eclampsia',
          'infertility_treatment','fertility_enhancing_drugs',
          'gonorrhea','syphillis','chlamydia','hep_b','hep_c',
          'induction','augmentation','steroids','antibiotics','chorioamnionitis','anesthesia',

          'infant_sex',
          'gestation_recode'
          
          ]

### Basic Packages
import pandas as pd
#import numpy as np

## DataLoad and Global Filtering

### read in the 2009 survey data from CSV 
prenatal_df  = pd.read_fwf('Nat2017PublicUS.c20180516.r20180808.txt', colspecs=colspecs, names=colnames, index_col=False, header=None, converters={col:str for col in colnames})

# compare birth weight to mother weight gain
blah_df = prenatal_df.groupby(['birth_weight_recode12','weight_gain_recode','infant_sex']).size().reset_index()
#blah_df.to_json('weight_gain-birth_weight.json',orient='records')
females_weight_df = blah_df[blah_df['infant_sex']=='F']
males_weight_df = blah_df[blah_df['infant_sex']=='M']
females_weight_df.columns=['birth_weight_recode12','weight_gain_recode','infant_sex','f_count']
males_weight_df.columns=['birth_weight_recode12','weight_gain_recode','infant_sex','m_count']
females_weight_df = females_weight_df.drop(['infant_sex'],axis=1)
males_weight_df = males_weight_df.drop(['infant_sex'],axis=1)
females_weight_df.set_index(['birth_weight_recode12','weight_gain_recode'],inplace=True)
males_weight_df.set_index(['birth_weight_recode12','weight_gain_recode'],inplace=True)
weight_df=pd.concat([females_weight_df,males_weight_df],join='inner',axis=1)
weight_df.reset_index(level=['birth_weight_recode12','weight_gain_recode']).to_json('weight_gain-birth_weight.json',orient='records')

# add in age of mother
raw_weight_age_df = prenatal_df.groupby(['birth_weight_recode12','weight_gain_recode','infant_sex','mother_age_recode9']).size().reset_index()
#blah_df.to_json('weight_gain-birth_weight.json',orient='records')
females_weight_age_df = raw_weight_age_df[raw_weight_age_df['infant_sex']=='F']
males_weight_age_df = raw_weight_age_df[raw_weight_age_df['infant_sex']=='M']
females_weight_age_df.columns=['birth_weight_recode12','weight_gain_recode','infant_sex','mother_age_recode9','f_count']
males_weight_age_df.columns=['birth_weight_recode12','weight_gain_recode','infant_sex','mother_age_recode9','m_count']
females_weight_age_df = females_weight_age_df.drop(['infant_sex'],axis=1)
males_weight_age_df = males_weight_age_df.drop(['infant_sex'],axis=1)
females_weight_age_df.set_index(['birth_weight_recode12','weight_gain_recode','mother_age_recode9'],inplace=True)
males_weight_age_df.set_index(['birth_weight_recode12','weight_gain_recode','mother_age_recode9'],inplace=True)
weight_age_df=pd.concat([females_weight_age_df,males_weight_age_df],join='inner',axis=1)
weight_age_df.reset_index(level=['birth_weight_recode12','weight_gain_recode','mother_age_recode9']).to_json('weight_gain-birth_weight-age.json',orient='records')


# compare birth weight to mother bmi 
raw_bmi_df = prenatal_df.groupby(['birth_weight_recode12','mother_bmi_recode','infant_sex']).size().reset_index()
females_bmi_df = raw_bmi_df[raw_bmi_df['infant_sex']=='F']
males_bmi_df = raw_bmi_df[raw_bmi_df['infant_sex']=='M']
females_bmi_df.columns=['birth_weight_recode12','mother_bmi_recode','infant_sex','f_count']
males_bmi_df.columns=['birth_weight_recode12','mother_bmi_recode','infant_sex','m_count']
females_bmi_df = females_bmi_df.drop(['infant_sex'],axis=1)
males_bmi_df = males_bmi_df.drop(['infant_sex'],axis=1)
females_bmi_df.set_index(['birth_weight_recode12','mother_bmi_recode'],inplace=True)
males_bmi_df.set_index(['birth_weight_recode12','mother_bmi_recode'],inplace=True)
bmi_df=pd.concat([females_bmi_df,males_bmi_df],join='inner',axis=1)
bmi_df.reset_index(level=['birth_weight_recode12','mother_bmi_recode']).to_json('bmi-birth_weight.json',orient='records')

# add in age of mother
raw_bmi_age_df = prenatal_df.groupby(['birth_weight_recode12','mother_bmi_recode','infant_sex','mother_age_recode9']).size().reset_index()
females_bmi_age_df = raw_bmi_age_df[raw_bmi_age_df['infant_sex']=='F']
males_bmi_age_df = raw_bmi_age_df[raw_bmi_age_df['infant_sex']=='M']
females_bmi_age_df.columns=['birth_weight_recode12','mother_bmi_recode','infant_sex','mother_age_recode9','f_count']
males_bmi_age_df.columns=['birth_weight_recode12','mother_bmi_recode','infant_sex','mother_age_recode9','m_count']
females_bmi_age_df = females_bmi_age_df.drop(['infant_sex'],axis=1)
males_bmi_age_df = males_bmi_age_df.drop(['infant_sex'],axis=1)
females_bmi_age_df.set_index(['birth_weight_recode12','mother_bmi_recode','mother_age_recode9'],inplace=True)
males_bmi_age_df.set_index(['birth_weight_recode12','mother_bmi_recode','mother_age_recode9'],inplace=True)
bmi_age_df=pd.concat([females_bmi_age_df,males_bmi_age_df],join='inner',axis=1)
bmi_age_df.reset_index(level=['birth_weight_recode12','mother_bmi_recode','mother_age_recode9']).to_json('bmi-birth_weight-age.json',orient='records')


weight_cigs_first_df = prenatal_df.groupby(['birth_weight_recode12','cigs_first_trimester_recode']).size().reset_index()
weight_cigs_second_df = prenatal_df.groupby(['birth_weight_recode12','cigs_second_trimester_recode']).size().reset_index()

# apgar vs cigs before pregnancy
raw_five_min_cigs_before_df = prenatal_df.groupby(['five_min_apgar','cigs_before_pregnancy_recode','infant_sex']).size().reset_index()
females_five_min_cigs_before_df = raw_five_min_cigs_before_df[raw_five_min_cigs_before_df['infant_sex']=='F']
males_five_min_cigs_before_df = raw_five_min_cigs_before_df[raw_five_min_cigs_before_df['infant_sex']=='M']
females_five_min_cigs_before_df.columns=['five_min_apgar','cigs_before_pregnancy_recode','infant_sex','f_count']
males_five_min_cigs_before_df.columns=['five_min_apgar','cigs_before_pregnancy_recode','infant_sex','m_count']
females_five_min_cigs_before_df = females_five_min_cigs_before_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_before_df = males_five_min_cigs_before_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_before_df.set_index(['five_min_apgar','cigs_before_pregnancy_recode'],inplace=True)
males_five_min_cigs_before_df.set_index(['five_min_apgar','cigs_before_pregnancy_recode'],inplace=True)
five_min_cigs_before_df=pd.concat([females_five_min_cigs_before_df,males_five_min_cigs_before_df],join='inner',axis=1)
five_min_cigs_before_df.reset_index(level=['five_min_apgar','cigs_before_pregnancy_recode']).to_json('five_min-cigs_before.json',orient='records')

# add in age of mother
raw_five_min_cigs_before_age_df = prenatal_df.groupby(['five_min_apgar','cigs_before_pregnancy_recode','infant_sex','mother_age_recode9']).size().reset_index()
females_five_min_cigs_before_age_df = raw_five_min_cigs_before_age_df[raw_five_min_cigs_before_age_df['infant_sex']=='F']
males_five_min_cigs_before_age_df = raw_five_min_cigs_before_age_df[raw_five_min_cigs_before_age_df['infant_sex']=='M']
females_five_min_cigs_before_age_df.columns=['five_min_apgar','cigs_before_pregnancy_recode','infant_sex','mother_age_recode9','f_count']
males_five_min_cigs_before_age_df.columns=['five_min_apgar','cigs_before_pregnancy_recode','infant_sex','mother_age_recode9','m_count']
females_five_min_cigs_before_age_df = females_five_min_cigs_before_age_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_before_age_df = males_five_min_cigs_before_age_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_before_age_df.set_index(['five_min_apgar','cigs_before_pregnancy_recode','mother_age_recode9'],inplace=True)
males_five_min_cigs_before_age_df.set_index(['five_min_apgar','cigs_before_pregnancy_recode','mother_age_recode9'],inplace=True)
five_min_cigs_before_age_df=pd.concat([females_five_min_cigs_before_age_df,males_five_min_cigs_before_age_df],join='inner',axis=1)
five_min_cigs_before_age_df.reset_index(level=['five_min_apgar','cigs_before_pregnancy_recode','mother_age_recode9']).to_json('five_min-cigs_before-age.json',orient='records')


# apgar vs cigs in first trimester
raw_five_min_cigs_first_df = prenatal_df.groupby(['five_min_apgar','cigs_first_trimester_recode','infant_sex']).size().reset_index()
females_five_min_cigs_first_df = raw_five_min_cigs_first_df[raw_five_min_cigs_first_df['infant_sex']=='F']
males_five_min_cigs_first_df = raw_five_min_cigs_first_df[raw_five_min_cigs_first_df['infant_sex']=='M']
females_five_min_cigs_first_df.columns=['five_min_apgar','cigs_first_trimester_recode','infant_sex','f_count']
males_five_min_cigs_first_df.columns=['five_min_apgar','cigs_first_trimester_recode','infant_sex','m_count']
females_five_min_cigs_first_df = females_five_min_cigs_first_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_first_df = males_five_min_cigs_first_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_first_df.set_index(['five_min_apgar','cigs_first_trimester_recode'],inplace=True)
males_five_min_cigs_first_df.set_index(['five_min_apgar','cigs_first_trimester_recode'],inplace=True)
five_min_cigs_first_df=pd.concat([females_five_min_cigs_first_df,males_five_min_cigs_first_df],join='inner',axis=1)
five_min_cigs_first_df.reset_index(level=['five_min_apgar','cigs_first_trimester_recode']).to_json('five_min-cigs_first.json',orient='records')

# add in age of mother
raw_five_min_cigs_first_age_df = prenatal_df.groupby(['five_min_apgar','cigs_first_trimester_recode','infant_sex','mother_age_recode9']).size().reset_index()
females_five_min_cigs_first_age_df = raw_five_min_cigs_first_age_df[raw_five_min_cigs_first_age_df['infant_sex']=='F']
males_five_min_cigs_first_age_df = raw_five_min_cigs_first_age_df[raw_five_min_cigs_first_age_df['infant_sex']=='M']
females_five_min_cigs_first_age_df.columns=['five_min_apgar','cigs_first_trimester_recode','infant_sex','mother_age_recode9','f_count']
males_five_min_cigs_first_age_df.columns=['five_min_apgar','cigs_first_trimester_recode','infant_sex','mother_age_recode9','m_count']
females_five_min_cigs_first_age_df = females_five_min_cigs_first_age_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_first_age_df = males_five_min_cigs_first_age_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_first_age_df.set_index(['five_min_apgar','cigs_first_trimester_recode','mother_age_recode9'],inplace=True)
males_five_min_cigs_first_age_df.set_index(['five_min_apgar','cigs_first_trimester_recode','mother_age_recode9'],inplace=True)
five_min_cigs_first_age_df=pd.concat([females_five_min_cigs_first_age_df,males_five_min_cigs_first_age_df],join='inner',axis=1)
five_min_cigs_first_age_df.reset_index(level=['five_min_apgar','cigs_first_trimester_recode','mother_age_recode9']).to_json('five_min-cigs_first-age.json',orient='records')

# apgar vs cigs in second trimester
raw_five_min_cigs_second_df = prenatal_df.groupby(['five_min_apgar','cigs_second_trimester_recode','infant_sex']).size().reset_index()
females_five_min_cigs_second_df = raw_five_min_cigs_second_df[raw_five_min_cigs_second_df['infant_sex']=='F']
males_five_min_cigs_second_df = raw_five_min_cigs_second_df[raw_five_min_cigs_second_df['infant_sex']=='M']
females_five_min_cigs_second_df.columns=['five_min_apgar','cigs_second_trimester_recode','infant_sex','f_count']
males_five_min_cigs_second_df.columns=['five_min_apgar','cigs_second_trimester_recode','infant_sex','m_count']
females_five_min_cigs_second_df = females_five_min_cigs_second_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_second_df = males_five_min_cigs_second_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_second_df.set_index(['five_min_apgar','cigs_second_trimester_recode'],inplace=True)
males_five_min_cigs_second_df.set_index(['five_min_apgar','cigs_second_trimester_recode'],inplace=True)
five_min_cigs_second_df=pd.concat([females_five_min_cigs_second_df,males_five_min_cigs_second_df],join='inner',axis=1)
five_min_cigs_second_df.reset_index(level=['five_min_apgar','cigs_second_trimester_recode']).to_json('five_min-cigs_second.json',orient='records')

# add in age of mother
raw_five_min_cigs_second_age_df = prenatal_df.groupby(['five_min_apgar','cigs_second_trimester_recode','infant_sex','mother_age_recode9']).size().reset_index()
females_five_min_cigs_second_age_df = raw_five_min_cigs_second_age_df[raw_five_min_cigs_second_age_df['infant_sex']=='F']
males_five_min_cigs_second_age_df = raw_five_min_cigs_second_age_df[raw_five_min_cigs_second_age_df['infant_sex']=='M']
females_five_min_cigs_second_age_df.columns=['five_min_apgar','cigs_second_trimester_recode','infant_sex','mother_age_recode9','f_count']
males_five_min_cigs_second_age_df.columns=['five_min_apgar','cigs_second_trimester_recode','infant_sex','mother_age_recode9','m_count']
females_five_min_cigs_second_age_df = females_five_min_cigs_second_age_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_second_age_df = males_five_min_cigs_second_age_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_second_age_df.set_index(['five_min_apgar','cigs_second_trimester_recode','mother_age_recode9'],inplace=True)
males_five_min_cigs_second_age_df.set_index(['five_min_apgar','cigs_second_trimester_recode','mother_age_recode9'],inplace=True)
five_min_cigs_second_age_df=pd.concat([females_five_min_cigs_second_age_df,males_five_min_cigs_second_age_df],join='inner',axis=1)
five_min_cigs_second_age_df.reset_index(level=['five_min_apgar','cigs_second_trimester_recode','mother_age_recode9']).to_json('five_min-cigs_second-age.json',orient='records')

# apgar vs cigs in third trimester
raw_five_min_cigs_third_df = prenatal_df.groupby(['five_min_apgar','cigs_third_trimester_recode','infant_sex']).size().reset_index()
females_five_min_cigs_third_df = raw_five_min_cigs_third_df[raw_five_min_cigs_third_df['infant_sex']=='F']
males_five_min_cigs_third_df = raw_five_min_cigs_third_df[raw_five_min_cigs_third_df['infant_sex']=='M']
females_five_min_cigs_third_df.columns=['five_min_apgar','cigs_third_trimester_recode','infant_sex','f_count']
males_five_min_cigs_third_df.columns=['five_min_apgar','cigs_third_trimester_recode','infant_sex','m_count']
females_five_min_cigs_third_df = females_five_min_cigs_third_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_third_df = males_five_min_cigs_third_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_third_df.set_index(['five_min_apgar','cigs_third_trimester_recode'],inplace=True)
males_five_min_cigs_third_df.set_index(['five_min_apgar','cigs_third_trimester_recode'],inplace=True)
five_min_cigs_third_df=pd.concat([females_five_min_cigs_third_df,males_five_min_cigs_third_df],join='inner',axis=1)
five_min_cigs_third_df.reset_index(level=['five_min_apgar','cigs_third_trimester_recode']).to_json('five_min-cigs_third.json',orient='records')

# add in age of mother
raw_five_min_cigs_third_age_df = prenatal_df.groupby(['five_min_apgar','cigs_third_trimester_recode','infant_sex','mother_age_recode9']).size().reset_index()
females_five_min_cigs_third_age_df = raw_five_min_cigs_third_age_df[raw_five_min_cigs_third_age_df['infant_sex']=='F']
males_five_min_cigs_third_age_df = raw_five_min_cigs_third_age_df[raw_five_min_cigs_third_age_df['infant_sex']=='M']
females_five_min_cigs_third_age_df.columns=['five_min_apgar','cigs_third_trimester_recode','infant_sex','mother_age_recode9','f_count']
males_five_min_cigs_third_age_df.columns=['five_min_apgar','cigs_third_trimester_recode','infant_sex','mother_age_recode9','m_count']
females_five_min_cigs_third_age_df = females_five_min_cigs_third_age_df.drop(['infant_sex'],axis=1)
males_five_min_cigs_third_age_df = males_five_min_cigs_third_age_df.drop(['infant_sex'],axis=1)
females_five_min_cigs_third_age_df.set_index(['five_min_apgar','cigs_third_trimester_recode','mother_age_recode9'],inplace=True)
males_five_min_cigs_third_age_df.set_index(['five_min_apgar','cigs_third_trimester_recode','mother_age_recode9'],inplace=True)
five_min_cigs_third_age_df=pd.concat([females_five_min_cigs_third_age_df,males_five_min_cigs_third_age_df],join='inner',axis=1)
five_min_cigs_third_age_df.reset_index(level=['five_min_apgar','cigs_third_trimester_recode','mother_age_recode9']).to_json('five_min-cigs_third-age.json',orient='records')


# gestational_diabetes vs birth_weight, broken down by infant_sex
raw_weight_gest_diab_df = prenatal_df.groupby(['birth_weight_recode12','gestational_diabetes','infant_sex']).size().reset_index()
females_weight_gest_diab_df = raw_weight_gest_diab_df[raw_weight_gest_diab_df['infant_sex']=='F']
males_weight_gest_diab_df = raw_weight_gest_diab_df[raw_weight_gest_diab_df['infant_sex']=='M']
females_weight_gest_diab_df.columns=['birth_weight_recode12','gestational_diabetes','infant_sex','f_count']
males_weight_gest_diab_df.columns=['birth_weight_recode12','gestational_diabetes','infant_sex','m_count']
females_weight_gest_diab_df = females_weight_gest_diab_df.drop(['infant_sex'],axis=1)
males_weight_gest_diab_df = males_weight_gest_diab_df.drop(['infant_sex'],axis=1)
females_weight_gest_diab_df.set_index(['birth_weight_recode12','gestational_diabetes'],inplace=True)
males_weight_gest_diab_df.set_index(['birth_weight_recode12','gestational_diabetes'],inplace=True)
weight_gest_diab_df=pd.concat([females_weight_gest_diab_df,males_weight_gest_diab_df],join='inner',axis=1)
weight_gest_diab_df.reset_index(level=['birth_weight_recode12','gestational_diabetes']).to_json('birth_weight-gest_diab.json',orient='records')


# number of babies broken down by infant_sex
raw_gender_df = pd.DataFrame(np.array(prenatal_df.groupby(['infant_sex']).size().reset_index()).reshape(-1,2), columns = ['infant_sex','count'])
raw_gender_df.to_json('baby-pie.json',orient='records')


# number of babies by mother age, broken out by infant_sex
raw_age_df = pd.DataFrame(np.array(prenatal_df.groupby(['mother_age_recode9','infant_sex']).size().reset_index()).reshape(-1,3), columns = ['mother_age_recode9','infant_sex','count'])
males_age_df = raw_age_df[raw_age_df['infant_sex']=='M']
females_age_df = raw_age_df[raw_age_df['infant_sex']=='F']
males_age_df.columns=['mother_age_recode9','infant_sex','m_count']
females_age_df.columns=['mother_age_recode9','infant_sex','f_count']
males_age_df = males_age_df.drop(['infant_sex'], axis=1)
females_age_df = females_age_df.drop(['infant_sex'], axis=1)
males_age_df.set_index(['mother_age_recode9'],inplace=True)
females_age_df.set_index(['mother_age_recode9'],inplace=True)
age_df = pd.concat([males_age_df,females_age_df], join='inner',axis=1)
age_df.reset_index(level=['mother_age_recode9']).to_json('mothers-age.json',orient='records')


# number of babies at each birthweight broken out by infant_sex
raw_birthweight_df = pd.DataFrame(np.array(prenatal_df.groupby(['birth_weight_recode12','infant_sex']).size().reset_index()).reshape(-1,3), columns = ['birth_weight_recode12','infant_sex','count'])
males_birthweight_df = raw_birthweight_df[raw_birthweight_df['infant_sex']=='M']
females_birthweight_df = raw_birthweight_df[raw_birthweight_df['infant_sex']=='F']
males_birthweight_df.columns=['birth_weight_recode12','infant_sex','m_count']
females_birthweight_df.columns=['birth_weight_recode12','infant_sex','f_count']
males_birthweight_df = males_birthweight_df.drop(['infant_sex'], axis=1)
females_birthweight_df = females_birthweight_df.drop(['infant_sex'], axis=1)
males_birthweight_df.set_index(['birth_weight_recode12'],inplace=True)
females_birthweight_df.set_index(['birth_weight_recode12'],inplace=True)
birthweight_df = pd.concat([males_birthweight_df,females_birthweight_df], join='inner',axis=1)
birthweight_df.reset_index(level=['birth_weight_recode12']).to_json('birthweight.json',orient='records')


# marital vs weight broken out by infant_sex
raw_marital_df = pd.DataFrame(np.array(prenatal_df.groupby(['marital_status','birth_weight_recode12','infant_sex']).size().reset_index()).reshape(-1,4), columns = ['marital_status','birth_weight_recode12','infant_sex','count'])
males_marital_df = raw_marital_df[raw_marital_df['infant_sex']=='M']
females_marital_df = raw_marital_df[raw_marital_df['infant_sex']=='F']
males_marital_df.columns=['marital_status','birth_weight_recode12','infant_sex','m_count']
females_marital_df.columns=['marital_status','birth_weight_recode12','infant_sex','f_count']
males_marital_df = males_marital_df.drop(['infant_sex'], axis=1)
females_marital_df = females_marital_df.drop(['infant_sex'], axis=1)
males_marital_df.set_index(['marital_status','birth_weight_recode12'],inplace=True)
females_marital_df.set_index(['marital_status','birth_weight_recode12'],inplace=True)
marital_df = pd.concat([males_marital_df,females_marital_df], join='inner',axis=1)
marital_df.reset_index(level=['marital_status','birth_weight_recode12']).to_json('marital-birthweight.json',orient='records')

# marital vs apgar broken out by infant_sex
raw_marital_apgar_df = pd.DataFrame(np.array(prenatal_df.groupby(['marital_status','five_min_apgar','infant_sex']).size().reset_index()).reshape(-1,4), columns = ['marital_status','five_min_apgar','infant_sex','count'])
males_marital_apgar_df = raw_marital_apgar_df[raw_marital_apgar_df['infant_sex']=='M']
females_marital_apgar_df = raw_marital_apgar_df[raw_marital_apgar_df['infant_sex']=='F']
males_marital_apgar_df.columns=['marital_status','five_min_apgar','infant_sex','m_count']
females_marital_apgar_df.columns=['marital_status','five_min_apgar','infant_sex','f_count']
males_marital_apgar_df = males_marital_apgar_df.drop(['infant_sex'], axis=1)
females_marital_apgar_df = females_marital_apgar_df.drop(['infant_sex'], axis=1)
males_marital_apgar_df.set_index(['marital_status','five_min_apgar'],inplace=True)
females_marital_apgar_df.set_index(['marital_status','five_min_apgar'],inplace=True)
marital_apgar_df = pd.concat([males_marital_apgar_df,females_marital_apgar_df], join='inner',axis=1)
marital_apgar_df.reset_index(level=['marital_status','five_min_apgar']).to_json('marital-apgar.json',orient='records')


# wic vs weight broken out by infant_sex
raw_wic_df = pd.DataFrame(np.array(prenatal_df.groupby(['wic','birth_weight_recode12','infant_sex']).size().reset_index()).reshape(-1,4), columns = ['wic','birth_weight_recode12','infant_sex','count'])
males_wic_df = raw_wic_df[raw_wic_df['infant_sex']=='M']
females_wic_df = raw_wic_df[raw_wic_df['infant_sex']=='F']
males_wic_df.columns=['wic','birth_weight_recode12','infant_sex','m_count']
females_wic_df.columns=['wic','birth_weight_recode12','infant_sex','f_count']
males_wic_df = males_wic_df.drop(['infant_sex'], axis=1)
females_wic_df = females_wic_df.drop(['infant_sex'], axis=1)
males_wic_df.set_index(['wic','birth_weight_recode12'],inplace=True)
females_wic_df.set_index(['wic','birth_weight_recode12'],inplace=True)
wic_df = pd.concat([males_wic_df,females_wic_df], join='inner',axis=1)
wic_df.reset_index(level=['wic','birth_weight_recode12']).to_json('wic-birthweight.json',orient='records')

# wic vs apgar broken out by infant_sex
raw_wic_apgar_df = pd.DataFrame(np.array(prenatal_df.groupby(['wic','five_min_apgar','infant_sex']).size().reset_index()).reshape(-1,4), columns = ['wic','five_min_apgar','infant_sex','count'])
males_wic_apgar_df = raw_wic_apgar_df[raw_wic_apgar_df['infant_sex']=='M']
females_wic_apgar_df = raw_wic_apgar_df[raw_wic_apgar_df['infant_sex']=='F']
males_wic_apgar_df.columns=['wic','five_min_apgar','infant_sex','m_count']
females_wic_apgar_df.columns=['wic','five_min_apgar','infant_sex','f_count']
males_wic_apgar_df = males_wic_apgar_df.drop(['infant_sex'], axis=1)
females_wic_apgar_df = females_wic_apgar_df.drop(['infant_sex'], axis=1)
males_wic_apgar_df.set_index(['wic','five_min_apgar'],inplace=True)
females_wic_apgar_df.set_index(['wic','five_min_apgar'],inplace=True)
wic_apgar_df = pd.concat([males_wic_apgar_df,females_wic_apgar_df], join='inner',axis=1)
wic_apgar_df.reset_index(level=['wic','five_min_apgar']).to_json('wic-apgar.json',orient='records')




