# moviematters v1.0

### The Inspiration:
A simple excel spreadsheet maintained manually by a movie enthusiast (Shrawan Sher) since 2003, that contains movie titles and personal ratings from 0-10 for over 780 movies. 

### Need for a tool !
As a cinephile, I want...

1. To understand my personal preferences in movies, and uncover hidden patterns.
2. To help recommmend movies I've viewed to others.

We built a simple visualization tool to help just that.
Check it out! 
[Movie Matters](https://shrawansher.github.io/moviematters/)

### How to use the tool?
1. Use the filters to drill down based on  year of release, genres, personal rating, runtime. 
1. Click on any bar to look at the ratings only for that year.
1. A movie is underrated personally, if you rate it signifcantly higher than IMDB. We chose a 0.05 p-value to statistically classify a movie as underrrated or overrated based on the difference between the personal and IMDB ratings.
