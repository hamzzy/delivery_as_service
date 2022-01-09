# Deliveries as a service

The goal for this challenge is to assess your coding skills and your fit in our team. We want to know how you'd tackle problems in your day-to-day, so keep that in mind at all times.

Important points we'll evaluate:

- Is the code well tested?
- Is the code safe?
- Is the code readable?
- Is the code easy to run?
- Is the solution correct?

## Problem Description

Your task is to build an API to allow the public to book their deliveries with our robots.

The booking process is as follows:

1. The client requests a quote for a delivery. For that we need to know the pick-up location and the drop-off location. If we have robots available we'll show the client a quote for the delivery.
   The quote is a flat fee rate. Eg: if the fee is set to 2 USD, then everyone will pay 2USD per delivery.

2. If the client accepts the quote, we assign the order to the nearest available robot.

Some notes:

- We want an HTTP API. The design of this API is up to you
- Use a [Cartesian coordinate system](https://en.wikipedia.org/wiki/Cartesian_coordinate_system), so coordinates are simply `(x, y)` pairs and distance between points can be Euclidean

## Solution

Submit your solution via e-mail in a compressed format, with instructions on how to run and test it.
