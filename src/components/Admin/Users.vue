<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-9">
                    <h2 class="title">Users</h2>

                    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="user in allUsers"
                                :key="user.id">
                                    <td>{{ user.firstName }}</td>
                                    <td>{{ user.lastName }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>
                                        <router-link :to="`/admin/users/${user.id}`">View</router-link>
                                    </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ALL_USERS_QUERY } from '@/graphql'

export default {
  name: 'Users',
  data () {
    return {
      allUsers: []
    }
  },
  apollo: {
    // fetch all users
    allUsers: {
      query: ALL_USERS_QUERY
    }
  }
}
</script>
