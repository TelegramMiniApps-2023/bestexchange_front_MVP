// App.js
import React, { useEffect, useState } from 'react'
import { Container, Typography, Button } from '@mui/material'
import GetCurrencyList from './components/GetCurrencyList'
import ResultList from './components/ResultList'

const tg = window.Telegram.WebApp

function App() {
  const [isShown, setIsShown] = useState(false)
  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState('')
  const [selectedTargetCurrency, setSelectedTargetCurrency] = useState('')

  // By this function we show hidden component
  const handleClick = () => {
    setIsShown((current) => !current)
  }

  // TG Button trigers upstairs handleClick(); 
  useEffect(() => {
    tg.ready()
    tg.MainButton.onClick(() => {
      tg.sendData("Моя какая-то дата неизвестная")
      tg.MainButton.setText("Теперь приложение работает на лету")
      tg.MainButton.color = "#FDFDFD"
      tg.MainButton.textColor = "#CCCCCC"
      tg.MainButton.disable()
      handleClick()
    })
  }, [])

  // From currency -- ResultList
  const handleBaseCurrencyChange = (baseCurrency) => {
    setSelectedBaseCurrency(baseCurrency)
  }

  // To currency -- ResultList
  const handleTargetCurrencyChange = (targetCurrency) => {
    setSelectedTargetCurrency(targetCurrency)
  }
  
  // useEffect to listen for changes in selectedBaseCurrency and selectedTargetCurrency
  useEffect(() => {
    if (selectedBaseCurrency && selectedTargetCurrency) {
      tg.MainButton.show()
      console.log("TG Button is here")
    }
  }, [selectedBaseCurrency, selectedTargetCurrency])

  const boxStyles = {
    background: "#fdfdfd",
    margin: "2.4rem 0",
    textAlign: "center",
    color: "#222",
    padding: "2rem",
    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
    position: "relative",
    width: "100%",
  }

  return (
    <>
      <Container sx={boxStyles}>
        <Typography variant="h6" component="div" className="tar">beta v.0.7</Typography>
        <Typography variant="h2" component="h1" gutterBottom>BestExChanger</Typography>
        
        <GetCurrencyList
          onBaseCurrencyChange={handleBaseCurrencyChange}
          onTargetCurrencyChange={handleTargetCurrencyChange}
        />
        
        {/* <Button variant="contained" onClick={handleClick}>
          TELEGRAMMED
        </Button> */}
      </Container>

      {isShown && <ResultList from={selectedBaseCurrency} to={selectedTargetCurrency} />}
    </>
  )
}

export default App
