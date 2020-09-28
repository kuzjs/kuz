
0.3.0 / (future)
====================
  * Implemented --serve


0.2.9 / (future)
====================
  * Compile layouts only when required


0.2.8 / (future)
====================
  * Corrected KuzPage.HasInputDirectory() to work for introverted pages


0.2.7 / 27-09-2020
====================
  * Added method KuzFile.ok()
  * Now checking if ok() before passing code / kuz to page
  * Added KuzFile.getCachedItems()
  * Now passing `p`


0.2.6 / 27-09-2020
====================
  * Now passing `k` and `s` objects
  * Now passing `layout` and `theme`
  * Added new keywords
  * Added `KuzCodeFile.getContent()`
  * Added more empty getters to KuzFile


0.2.5 / 27-09-2020
====================
  * Implemented `metaData.getKuzs()`
  * Implemented `metaData.getCodeFiles()`
  * Now not watching by default
  * Renamed `kuz-fs` to `kuz-fsutils`


0.2.4 / 27-09-2020
====================
  * Implemented `KuzFile.getFilePath()`
  * Implemented `metaData.getJsons()`
  * Done away with `site.json`


0.2.3 / 27-09-2020
====================
  * Moved `KuzMetaData` methods to `KuzFile`
  * Removed unused methods
  * Now `KuzPage` and `KuzKonfig` do not deal with `KuzMetaData` directly
  * Corrected more func names in `fsutils`


0.2.2 / 27-09-2020
====================
  * Simplified options passed to page
  * Corrected func names in `fsutils`


0.2.1 / 26-09-2020
====================
  * Now using `packageJson` for `--version`
  * Added `kuzFile` to `site`
  * Added class: `KuzMetaSection`
  * Now `KuzContent` does not cache sections
  * Added empty class `KuzBox`


0.2.0 / 26-09-2020
====================
  * Removed article and section from KuzPage


0.1.9 / 26-09-2020
====================
  * Added sections to KuzContent
  * Added class KuzContentSection
  * Added metaSections and contentSections to page.getKuz()


0.1.8 / 26-09-2020
====================
  * Now root entries are enclosed in parenthesis
  * Added basic KuzContent class


0.1.7 / 26-09-2020
====================
  * Corrected listStuff() for zero operands
  * Single function exports to files inside kuz-kuzfile


0.1.6 / 26-09-2020
====================
  * Implemented --benchmark
  * Implemented --watch


0.1.5 / 25-09-2020
====================
  * Now --help and --version work without setting up site
  * Implemented --suggestions and --warnings


0.1.4 / 25-09-2020
====================
  * Formatted the code
  * Removed getRenderables() and getEntities()
  * Added new flags (disklog, suggestions, warnings)


0.1.3 / 24-09-2020
====================
  * Corrected internal JSON paths


0.1.2 / 24-09-2020
====================
  * Added pug and express as dependencies


0.1.1 / 24-09-2020
====================
  * Corrected benchmark titles


0.1.0 / 24-09-2020
====================
  * First NPM release


