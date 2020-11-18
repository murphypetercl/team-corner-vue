<template>
    <div>
      <b-nav tabs>
        <b-nav-item :to="{path: '/'}"><b-icon icon="chevron-left"></b-icon></b-nav-item>
        <b-nav-item :to="{path: '/admin/games'}" exact exact-active-class="active">Games</b-nav-item>
        <b-nav-item :to="{path: '/admin/games/charts'}" exact exact-active-class="active">Progression Charts</b-nav-item>
      </b-nav>
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'Games'
}

</script>
