export default function buildMongoOrders(orderBy) {
  const [fieldName, direction] = orderBy.split('_')

  return {
    [fieldName]: direction === 'DESC' ? -1 : 1
  }
}