// Third-party Imports
import { cookies } from 'next/headers'

import CredentialProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  //  adapter: PrismaAdapter(prisma) as Adapter,

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const { email, password, rememberMe } = credentials as { email: string; password: string; rememberMe: boolean }

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL_API}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, rememberMe })
          })

          const data = await res.json()

          if (res.status === 400 || res.status === 401) {
            throw new Error(JSON.stringify({ message: ['Email ou senha inválidos'] }))
          }

          if (res.status === 200 || res.status === 201) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            cookies().set('token', data.accessToken)

            // cookies().set('userData', data.userData)
            const user = {
              ...data.userData,
              id: data.userData.id,
              email: data.userData.email

              //name: data.userData.nome,
              //image: data.userData.foto,
              //role: data.userData.roles
            }

            //console.log('return user', user)

            return user
          }

          return null
        } catch (e: any) {
          throw new Error(e.message)
        }
      }
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      //console.log('callback jwt entrada: ', 'token: ', token, 'user: ', user)

      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */

        //id: string
        //name?: string | null
        //email?: string | null
        //image?: string | null
        //token.name = user.name
        //token.role = user.role

        token.id = Number(user.id)
        token.token = user.token
        token.nome = user.nome
        token.email = user.email
        token.isAdmin = user.isAdmin
        token.roles = user.roles
        token.foto = user.foto
        token.rememberMe = user.rememberMe
        token.dataUltimoAcesso = user.dataUltimoAcesso

        //propriedades default do objeto user
        //token.email = user.email
        //token.name = user.nome
        //token.image = user.foto
        //token.role = user.roles
      }

      //console.log('callback jwt saida: ', 'token: ', token)

      return token
    },
    async session({ session, token }) {
      //console.log('callback session entrada', 'token: ', token, 'session: ', session)

      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter

        session.user.id = token.id
        session.user.token = token.token
        session.user.nome = token.nome
        session.user.email = token.email
        session.user.isAdmin = token.isAdmin
        session.user.roles = token.roles
        session.user.foto = token.foto
        session.user.rememberMe = token.rememberMe
        session.user.dataUltimoAcesso = token.dataUltimoAcesso

        //propriedades default do objeto user
        //session.user.email = token.email
        //session.user.name = token.nome
        //session.user.image = token.foto
        //session.user.role = token.roles
      }

      //console.log('callback session saida', 'token: ', token, 'session: ', session)

      return session
    }
  }
}
