# RSLang - приложение для изучения английского языка, созданное небольшой командой разработчиков.
## Ссылка на приложение: https://dumbus.github.io/rslang/ 
## Описание технологий, которые были задействованы в процессе разработки:  
### SCSS  
Препроцессор SCSS языка CSS позволил нам более эффективно описывать стили для нашего приложения.  
#### Преимущества SCSS:  
* Удобное описание переменных. Это было необходимо, так как у нас было описано большое количество цветов для стилизации похожих элементов.  
* Вложенность селекторов. Это было необходимо для того, чтобы сделать код стилей более структурированным и читаемым.  
* Фрагментирование и импорт. Для наибольшей наглядности и удобства ориентирования мы разделили наш код на отдельные модули, описывающие какие-либо отдельные блоки нашего приложения.  

### TypeScript  
TypeScript - язык программирования, расширяющий возможности языка JavaScript, помог нам избежать большого количества ошибок при написании кода благодаря строгой типизации.    
#### Преимущества TypeScript:  
* Строгая типизация, которая позволяет избежать большого количества ошибок в рантайме.  
* Поддержка IDE. Большинство современных IDE могут предоставлять подсказки по написанию кода во время его написания.  
* Поддержка новейших функций JavaScript. Компилятор TypeScript помогает использовать новые функции языка программирования без написания полифилов.  
#### Недостатки TypeScript:  
* Сниженная скорость разработки.  
* Требует компиляции.  
* Тяжелее поддерживать код.

### Webpack  
Webpack - сборщик модулей, который упростил нам выстроить процесс разработки при помощи разбиения TypeScript кода на модули, которые были потом собраны в один JavaScript файл сборщиком.
#### Преимущества Webpack:  
* При помощи Webpack мы собрали production-версию приложения после окончания работы над ним.
* Минимизация HTML И JavaScript кода для ускорения загрузки приложения.
* Live-server для просмотра изменений в реальном времени при разработке.
#### Недостатки Webpack:
* Уходит время на настройку Webpack.
