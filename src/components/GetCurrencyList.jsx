import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  CircularProgress,
} from '@mui/material'

const API_BASE_URL = 'https://wttonline.ru/api'

// the Component
const GetCurrencyList = ({ onBaseCurrencyChange, onTargetCurrencyChange }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [baseCurrencies, setBaseCurrencies] = useState([])
  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState('')
  const [availableDirections, setAvailableDirections] = useState([])
  const [selectedTargetCurrency, setSelectedTargetCurrency] = useState('')

  // All currencies response
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseCurrenciesResponse = await axios.get(`${API_BASE_URL}/valute/no_cash`)
        console.log('1) All currencies response:', baseCurrenciesResponse.data)
        setBaseCurrencies(baseCurrenciesResponse.data)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setError('An error occurred while fetching data.')
        setLoading(false)
      }
    }
  
    fetchData()
  }, [])

  // Select the Base currency
  const handleBaseCurrencyChange = async (event) => {
    const selectedBaseCurrency = event.target.value;
    setSelectedBaseCurrency(selectedBaseCurrency);
    setSelectedTargetCurrency('') // Reset the value of the second Select
    onTargetCurrencyChange('') // Reset the value of the second Select
    console.log('2) Selected base currency:', selectedBaseCurrency)

    try {
      const availableDirectionsResponse = await axios.get(
        `${API_BASE_URL}/available_directions?base=${selectedBaseCurrency}`
      )
      setAvailableDirections(availableDirectionsResponse.data)
      console.log('3) Available directions response:', availableDirectionsResponse.data)
      
      // Notify App component about the change
      onBaseCurrencyChange(selectedBaseCurrency)
    } catch (error) {
      console.error(error)
      setError('An error occurred while fetching available directions.')
    }
  }

  // Select Target currency
  const handleTargetCurrencyChange = (event) => {
    const selectedTargetCurrency = event.target.value
    setSelectedTargetCurrency(selectedTargetCurrency)
    // Notify App component about the change
    onTargetCurrencyChange(selectedTargetCurrency)
  }

  // Component that generates Items into Selet, from Json
  const renderMenuItems = (data) => {
    console.log('5) Rendering menu items with data:', data)

    if (!data) {
      return null
    }
  
    return Object.keys(data).map((category) => {
      const categoryData = data[category]
      return [
        <ListSubheader key={`subheader-${category}`}>{category}</ListSubheader>,
        ...categoryData.map((item) => (
          <MenuItem key={item.code_name} value={item.code_name}>
            {item.name}
          </MenuItem>
        ))
      ]
    })
  }

  // ..LADING
  if (loading) {
    return <CircularProgress />
  }

  // ..ERROR
  if (error) {
    return <p>Error loading data. {error}</p>
  }

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 320 }}>
        <InputLabel htmlFor="base-currency-select"> Выберите что даёте </InputLabel>
        <Select
          value={selectedBaseCurrency}
          id="base-currency-select"
          label="Select Base Currency"
          onChange={handleBaseCurrencyChange}
        >
          {renderMenuItems(baseCurrencies)}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 320 }}>
        <InputLabel htmlFor="target-currency-select"> Что хотите получить </InputLabel>
        <Select
          value={selectedTargetCurrency}
          id="target-currency-select"
          label="Select Target Currency"
          onChange={handleTargetCurrencyChange}
        >
          {renderMenuItems(availableDirections)}
        </Select>
      </FormControl>

    </>
  )
}

export default GetCurrencyList
