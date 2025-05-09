import type { Meta, StoryObj } from '@storybook/react';
import CountryCard from './CountryCard';

const meta: Meta<typeof CountryCard> = {
  title: 'Components/CountryCard',
  component: CountryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CountryCard>;

export const Default: Story = {
  args: {
    country: {
      name: 'Germany',
      capital: 'Berlin',
      region: 'Europe',
      subregion: 'Western Europe',
      population: 83000000,
      area: 357022,
      flags: {
        png: 'https://flagcdn.com/w320/de.png',
        svg: 'https://flagcdn.com/de.svg',
      },
      alpha2Code: 'DE',
      alpha3Code: 'DEU',
      borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
      continents: ['Europe'],
    },
  },
};

export const WithoutCapital: Story = {
  args: {
    country: {
      name: 'Antarctica',
      region: 'Polar',
      population: 1000,
      flags: {
        png: 'https://flagcdn.com/w320/aq.png',
        svg: 'https://flagcdn.com/aq.svg',
      },
      alpha2Code: 'AQ',
      alpha3Code: 'ATA',
      continents: ['Antarctica'],
    },
  },
};
