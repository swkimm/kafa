import seedLocal from './local'
import seedProd from './production'

const isDev = false

const main = async () => {
  try {
    isDev ? await seedLocal() : await seedProd()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
