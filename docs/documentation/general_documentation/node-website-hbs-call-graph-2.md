

```mermaid
classDiagram 


%% javascript : %%

javascript : public javascript files 



%% Partials  %%

partials : partial hbs files 

%% Connections  %%

homepage: homepage.hbs
homepage -- partials : header 
homepage -- partials : map 
homepage -- partials : card 

device_info -- partials : header 
device_info -- partials : info_grid 
device_info -- partials : map 
device_info -- partials : deviceHistoryList 

user_profile -- partials : header
user_profile -- partials : membershipCard
user_profile -- javascript: user_profile.js

partials -- header 
header -- javascript : searchbar.js

header -- partials: searchbar
header -- partials : sign_in_up
header -- partials : profile_picture


map -- javascript : map.js 

searchbar -- javascript: searchbar.js 

sign_in_up -- javascript : sign_in.js


```