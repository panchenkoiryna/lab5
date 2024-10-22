import 'regenerator-runtime/runtime';
import { graphql, buildSchema } from 'graphql';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import axios from 'axios';

const schema = buildSchema(`
  type Query {
    hello: String
    weather(city: String!): Weather
  }

  type Weather {
    temperature: Float
    description: String
  }
`);

const root = {
  hello: () => {
    return 'Hello 3!';
  },
  weather: async ({ city }) => {
    const apiKey = '486097a3fcebe8f655c337761ca013dd'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
      const response = await axios.get(url);
      const data = response.data;

      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
      };
    } catch (error) {
      throw new Error('Could not fetch weather data');
    }
  },
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4003, () => {
  console.log('Server is running on http://localhost:4003/graphql');
});
