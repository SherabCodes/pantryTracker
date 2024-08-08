'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, InputAdornment } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const pastelColors = {
  background: '#E0F7FA', // Light pastel cyan -> background
  header: '#D5B8FF',     // Pastel orange ->  header
  itemContainer: '#D8B4A6', // Pastel peach -> item containers
  button: '#87CEEB',     // Pastel pink -> buttons
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: pastelColors.header,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    if (!item) {
      console.error('Item name is required.')
      return
    }
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    if (!item) {
      console.error('Item name is required.')
      return
    }
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{ bgcolor: '#D8B4A6', color: 'black' }}
    >

      <Typography variant="h4" color="black" sx={{ mb: 2 }}>
        Inventory Tracking App 
      </Typography>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{
                sx: { color: 'black' },
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                } else {
                  console.error('Item name cannot be empty.')
                }
              }}
              sx={{ color: 'black', borderColor: 'black' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <TextField
        label="Search Items"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start" sx={{ color: 'black' }}>🔍</InputAdornment>,
          sx: { color: 'black' }
        }}
        sx={{ mb: 2, width: 300 }}
      />

      <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: pastelColors.button, color: 'black' }}>
        Add New Item
      </Button>

      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={pastelColors.header}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'black'} textAlign={'center'}>
            List Of Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={ '#E0FFFF'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'black'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'black'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{ bgcolor:  '#87CEEB', color: 'black' }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{ bgcolor: '#87CEEB', color: 'black' }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

