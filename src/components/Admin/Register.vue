<template>
  <b-overlay :show="registering" spinner-variant="primary" rounded="sm">
    <br/>
      <h2>User Registration</h2>
    <br/>
    <ValidationObserver v-slot="{ invalid }">
      <b-form @submit.prevent="register">
        <b-container fluid>
          <b-row class="my-1" v-for="fields in registerFields" :key="fields.name">
            <b-col sm="1">
              <b><label :for="`${fields.name}`">{{ fields.label }}</label></b>
            </b-col>
            <b-col sm="5">
              <b-form-input  :type="fields.type" v-model="registration[fields.name]" :name="`${fields.name}`"></b-form-input>
            </b-col>
          </b-row>
          <p class="control">
            <button class="button is-primary is-fullwidth is-uppercase">Register</button>
          </p>
        </b-container>
      </b-form>
    </ValidationObserver>
    <b-modal id="bv-modal-register" hide-footer>
      <template v-slot:modal-title>
        Team Corner Registration Confirmed
      </template>
      <div class="d-block text-center">
        Thank you for submitting your registration to Team Corner. An admin will approve your request shortly.
      </div>
      <b-button class="mt-3" block @click="closeAndRedirect">OK</b-button>
    </b-modal>
  </b-overlay>
</template>

<script>
import { SIGNUP_MUTATION } from '@/graphql'

export default {
  name: 'Register',
  data () {
    return {
      registration: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      registerFields: [
        { label: 'First Name', type: 'text', name: 'firstName' },
        { label: 'Last Name', type: 'text', name: 'lastName' },
        { label: 'E-mail', type: 'email', name: 'email' },
        { label: 'Password', type: 'password', name: 'password' }
      ],
      registering: false
    }
  },
  methods: {
    register () {
      this.registering = true
      this.$apollo
        .mutate({
          mutation: SIGNUP_MUTATION,
          variables: {
            data: this.registration
          }
        })
        .then(response => {
          this.registering = false
          // redirect to login page
          this.$bvModal.show('bv-modal-register')
          // this.$router.replace('/login')
        })
    },
    closeAndRedirect () {
      this.$bvModal.hide('bv-modal-register')
      this.$router.replace('/login')
    }
  }
}
</script>
