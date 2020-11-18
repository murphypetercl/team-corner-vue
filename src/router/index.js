import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Admin/Register'
import UserRegistrationsList from '@/components/Admin/UserRegistrationsList'
import LogIn from '@/components/Admin/LogIn'
import Users from '@/components/Admin/Users'
import CreateGame from '@/components/Admin/CreateGame'
import Games from '@/components/Admin/Games'
import GamesList from '@/components/Admin/GamesList'
import GamesCharts from '@/components/Admin/GamesCharts'
import Game from '@/components/Admin/Game'
import GameOverview from '@/components/Admin/GameOverview'
import GameLogs from '@/components/Admin/GameLogs'
import GameStatistics from '@/components/Admin/GameStatistics'
import GamePuckouts from '@/components/Admin/GamePuckouts'
import GameShots from '@/components/Admin/GameShots'
import GameLog from '@/components/Admin/GameLog'
import Home from '@/components/Admin/Home'
import GameLogUpload from '@/components/Admin/GameLogUpload'
import GamePuckoutsUpload from '@/components/Admin/GamePuckoutsUpload'
import GameShotDetailsUpload from '@/components/Admin/GameShotDetailsUpload'
import GameLogCreate from '@/components/Admin/GameLogCreate'
import Schedule from '@/components/Admin/Schedule'
import EventCreate from '@/components/Admin/EventCreate'
import Event from '@/components/Admin/Event'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/user/registration/list',
      name: 'UserRegistrationsList',
      component: UserRegistrationsList
    },
    {
      path: '/login',
      name: 'LogIn',
      component: LogIn
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/admin/game/create',
      name: 'CreateGame',
      component: CreateGame
    },
    {
      path: '/admin/games',
      name: 'Games',
      component: Games,
      children: [
        {
          path: '/admin/games',
          name: 'GamesList',
          component: GamesList
        },
        {
          path: '/admin/games/charts',
          name: 'GamesCharts',
          component: GamesCharts
        }
      ]
    },
    {
      path: '/admin/game',
      component: Game,
      props (route) {
        return route.query || {}
      },
      children: [
        {
          path: '/admin/game',
          name: 'Game',
          component: GameOverview,
          props (route) {
            return route.query || {}
          }
        },
        {
          path: '/admin/game/logs',
          name: 'GameLogs',
          component: GameLogs,
          props (route) {
            return route.query || {}
          }
        },
        {
          path: '/admin/game/stats',
          name: 'GameStatistics',
          component: GameStatistics,
          props (route) {
            return route.query || {}
          }
        },
        {
          path: '/admin/game/puckouts',
          name: 'GamePuckouts',
          component: GamePuckouts,
          props (route) {
            return route.query || {}
          }
        },
        {
          path: '/admin/game/shots',
          name: 'GameShots',
          component: GameShots,
          props (route) {
            return route.query || {}
          }
        }
      ]
    },
    {
      path: '/admin/game/log',
      name: 'GameLog',
      component: GameLog,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/admin/game/log/upload',
      name: 'GameLogUpload',
      component: GameLogUpload,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/admin/game/puckouts/upload',
      name: 'GamePuckoutsUpload',
      component: GamePuckoutsUpload,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/admin/game/shots/upload',
      name: 'GameShotDetailsUpload',
      component: GameShotDetailsUpload,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/admin/game/log/create',
      name: 'GameLogCreate',
      component: GameLogCreate,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/admin/schedule',
      name: 'Schedule',
      component: Schedule,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/admin/event/create',
      name: 'EventCreate',
      component: EventCreate,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/admin/event',
      name: 'Event',
      component: Event,
      props (route) {
        return route.query || {}
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('team-corner-token')

  // const { authorize } = to.meta

  if (authRequired && !loggedIn) {
    // return next('/login')
    return next({ path: '/login' })
  } else {
    next()
  }

  // check if route is restricted by role
  // if (authorize.length && !authorize.includes(loggedIn.role)) {
  // role not authorised so redirect to home page
  // return next({ path: '/' })
  // }

  // next()
})
