<template>
    <div>
      <b-nav tabs>
        <b-nav-item :to="{path: '/admin/games'}"><b-icon icon="chevron-left"></b-icon></b-nav-item>
        <b-nav-item :to="{path: '/admin/game', query: {id: id}}" exact exact-active-class="Active">Overview</b-nav-item>
        <b-nav-item :to="{path: '/admin/game/logs', query: {id: id}}" exact exact-active-class="Active">Logs</b-nav-item>
        <b-nav-item :to="{path: '/admin/game/stats', query: {id: id}}" exact exact-active-class="Active">Statistics</b-nav-item>
        <b-nav-item :to="{path: '/admin/game/puckouts', query: {id: id}}" exact exact-active-class="Active">Puckouts</b-nav-item>
        <b-nav-item :to="{path: '/admin/game/shots', query: {id: id}}" exact exact-active-class="Active">Shots</b-nav-item>
      </b-nav>
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  props: ['id']
}

</script>
