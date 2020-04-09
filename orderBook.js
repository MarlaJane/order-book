function reconcileOrder(existingBook, incomingOrder) {
  const oppOrderTypes = existingBook.filter(order => order.type !== incomingOrder.type)
  let updatedBook = existingBook.filter(order => order.type === incomingOrder.type)
  updatedBook = oppOrderTypes.length
    ? updatedBook.concat(hasSamePrice(oppOrderTypes, incomingOrder))
    : updatedBook.concat(incomingOrder)
  return updatedBook
}

const hasSamePrice = (existingBook, incomingOrder) => {
  let index = incomingOrder.type === 'sell' ? existingBook.findIndex(order => order.price >= incomingOrder.price)
    : existingBook.findIndex(order => order.price <= incomingOrder.price)
  return index >= 0 ? hasSameQuantity(existingBook, incomingOrder, index)
    : existingBook.concat(incomingOrder)
}

const hasSameQuantity = (existingBook, incomingOrder, index) => {
  if (existingBook[index].quantity === incomingOrder.quantity) {
    existingBook.splice(index, 1)
    return existingBook
  }
  else if (existingBook[index].quantity > incomingOrder.quantity) {
    existingBook[index].quantity -= incomingOrder.quantity
    return existingBook
  }
  else if (existingBook[index].quantity < incomingOrder.quantity) {
    incomingOrder.quantity -= existingBook[index].quantity
    existingBook.splice(index, 1)
    return hasSamePrice(existingBook, incomingOrder)
  }
}


module.exports = reconcileOrder
