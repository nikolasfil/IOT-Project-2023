
## Folders and files 

```mermaid
classDiagram 



%% Controllers  %%

controllers : c_search.js
controllers : database.js
controllers : helpers.js
controllers : login.js

%% Public   %%

%% CSS   %%

css : button.css
css : card.css
css : carousel.css
css : filters.css
css : footer.css
css : header.css
css : map.css
css : pages.css
css : searchbar.css
css : sign_in.css
css : style.css

css -- css_individual_pages 
css_individual_pages : about.css
css_individual_pages : device_info.css
css_individual_pages : index.css
css_individual_pages : user_profile.css

%% javascript : %%

javascript : alerting.js
javascript : filters.js
javascript : map.js
javascript : searchbar.js
javascript : search_page.js
javascript : show_pages.js
javascript : sign_in.js
javascript : user_profile.js


%% Views  %%

views : about.hbs
views : device_info.hbs
views : homepage.hbs
views : search.hbs
views : user_profile.hbs

%% Layouts %%

views -- layouts 
layouts -- main
main: main.hbs

%% Partials  %%

views -- partials
partials : card.hbs
partials : deviceHistoryList.hbs
partials : device_placement.hbs
partials : devices_grid.hbs
partials : filterCategories.hbs
partials : footer.hbs
partials : header.hbs
partials : info_grid.hbs
partials : map.hbs
partials : membershipCard.hbs
partials : profile_picture.hbs
partials : searchbar.hbs
partials : sign_in_up.hbs
partials : timeline.hbs

```


## Connections HBS 

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


## Connections JS 


