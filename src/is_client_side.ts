export default function isClientSide () {
  return typeof window !== 'undefined'
}
