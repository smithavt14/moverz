## Overview
Built in the fall of 2019 for an external client. The WeChat Mini Program is meant for environmentally sustainable package delivery throughout China. You can view a [walkthrough of the app here](https://cloud-minapp-33044.cloud.ifanrusercontent.com/1n3pypnDnXOdTsPC.mov). 

## Development
The Mini Program was built using [Minapp](https://cloud.minapp.com/) on the backend and WeChat on the frontend. Mainly JS. 

## Challenges
We tackled a few challenges in this Mini Program. The first being WeChat Payments, allowing users to settle payments directly in the app. The second being how to calculate the price of different courrier routes. The price needed to be variable based on weight, distance, and time of day. We settled on the [setPrice](https://github.com/smithavt14/moverz/blob/master/utils/order.js) function in the order.js file. 

Finally, the [emissions calculation](https://github.com/smithavt14/moverz/blob/master/utils/emission.js) was a bit difficult to conceptualize initially, but turned out to be quite simple. 

## Next Steps
The development of this application was handed over to an in-house development team. They've continued to build on-top of the original functionality while keeping most of the original code untouched. 
