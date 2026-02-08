## 🌐 Live Demo
[Netlify](https://squallerq-performance.netlify.app/)

## 🖥️ Screenshot
![Performance](public/screenshot.png)

## Performance Report

### Before Optimization

- **Search**:
  - Commit Duration: 2.5s
  - Render Duration (CountriesTable): 28.9ms
  - Screenshot Flame: ![Search Flame](docs/before/search/search_flame.png)
  - Screenshot Ranked: ![Search Ranked](docs/before/search/search_ranked.png)
  - Screenshot: ![Search](docs/before/search/search.png)

- **Year Change**:
  - Commit Duration: 6.7s
  - Render Duration (CountriesTable): 99ms
  - Screenshot Flame: ![Year Flame](docs/before/year/year_flame.png)
  - Screenshot Ranked: ![Year Ranked](docs/before/year/year_ranked.png)
  - Screenshot: ![Year](docs/before/year/year.png)

- **Sorting (Column)**:
  - Commit Duration: 1s
  - Render Duration (CountriesTable): 102ms
  - Screenshot Flame: ![Sort Flame](docs/before/sorting/sort_flame.png)
  - Screenshot Ranked: ![Sort Ranked](docs/before/sorting/sort_ranked.png)
  - Screenshot: ![Sort](docs/before/sorting/sort.png)


### After Optimization

- **Search**:
  - Commit Duration: 1.8s
  - Render Duration (CountriesTable): 16.7ms
  - Screenshot Flame: ![Search Flame](docs/after/search/search_flame.png)
  - Screenshot Ranked: ![Search Ranked](docs/after/search/search_ranked.png)
  - Screenshot: ![Search](docs/after/search/search.png)

- **Year Change**:
  - Commit Duration: 1.6s
  - Render Duration (CountriesTable): 108.4ms
  - Screenshot Flame: ![Year Flame](docs/after/year/year_flame.png)
  - Screenshot Ranked: ![Year Ranked](docs/after/year/year_ranked.png)
  - Screenshot: ![Year](docs/after/year/year.png)
  - Full Screenshot: ![Full](docs/after/year/full.png)

- **Sorting (Column)**:
  - Commit Duration: 1.5s
  - Render Duration (CountriesTable): 10.9ms
  - Screenshot Flame: ![Sort Flame](docs/after/sorting/sort_flame.png)
  - Screenshot Ranked: ![Sort Ranked](docs/after/sorting/sort_ranked.png)
  - Screenshot: ![Sort](docs/after/sorting/sort.png)
