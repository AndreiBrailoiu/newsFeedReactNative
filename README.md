
# ReadZ - News made for you

The News Feed app offers users a convenient way to stay informed about major events around the world. Upon launching the app, users are greeted with the main headlines on the main page, giving them a quick overview of the latest news.\
In addition to the main headlines, the app also features a second page where users can easily search for topics of interest using a search bar or by selecting from predefined categories. This allows users to delve deeper into stories that matter to them, and to stay up to date with developments in their areas of interest.\
To make the app even more useful, a basic weather featur was included based on the user's location. This feature is designed to be simple and unobtrusive, providing users with the current weather conditions without taking up too much space or distracting from the main content.\
Finally, the app includes a third page where users can save articles and pages that they want to revisit later. These saved pages are stored locally on the device, making them easily accessible even when the user is offline. Moreover, the articles can be shared via e-mail.\
To add a bit of fun and levity to the app, the developer have included a smily face that presents users with a random joke whenever they want a quick break from reading the news.
## API Reference

#### https://newsapi.org/

```http
  https://newsapi.org/v2/top-headlines?country=us&apiKey=?
```
```http
  https://newsapi.org/v2/everything?q=" + search + "&apiKey=?
```
```http
  https://newsapi.org/v2/top-headlines?country=us&category=" + search + "&apiKey=?"
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `search` | `string` | **Required**. Custom search Parameter |
| `apiKey` | `string` | **Required**. Your API key |

#### https://openweathermap.org/

```http
  https://api.openweathermap.org/data/2.5/weather?lat=" + (location ? location.coords.latitude : '') + "&lon=" + (location ? location.coords.longitude : '') + "&units=metric&appid=?
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `lat`      | `string` | **Required**. latitude |
| `lon`      | `string` | **Required**. longitude |
| `appid`      | `string` | **Required**. Your API key |

#### https://official-joke-api.appspot.com/random_joke

Returns the setup and a punchline. No paramenters required.


## Optimizations

Flatlist on the first page increased in size to allocate more articles without hindering performance.\
Alerts and Warnings easy to dismiss.\
Optimal layout to display the cards tested on several resolutions.\
ScrollView used for the second and third page.\
Different layout approach on the second page, displays a larger image, hopefully providing more insight towards finding the desired content.\
App freezes, lags and few crashes fixed.\
Animations simplified and removed unnecessary ones.\
Added button group for quick category browsing.\
Splashscreen added, app Icon added, build parameters updated.


## Authors

- [@AndreiBrailoiu](https://github.com/AndreiBrailoiu)

