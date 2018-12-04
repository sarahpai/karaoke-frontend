class User {
  constructor({id, room_id, name}) {
    this.id = id
    this.room_id = room_id
    this.name = name
    User.all.push(this)
  }

  get songs() {
    return Playlist.all.filter(p => p.user_id == this.id).map(pl => pl.song)
  }

  render() {
    return `<li class="list-group-item">${this.name}</li>`
  }

  renderSelectOption() {
    return `<option value="${this.id}">${this.name}</li>`
  }

  static find(id) {
    return this.all.find(u => u.id == id)
  }

  static findBy(key, value) {
    return this.all.find(a => a[key] == value)
  }

  static render() {
    return this.all.map(r => r.render()).join('')
  }

  static renderSelectOptions() {
    return this.all.map(r => r.renderSelectOption()).join('')
  }

  static populateFromAPI() {
    return this.adapter.getAll()
      .then(json => {
        json.forEach(userObj => new User(userObj))
      })
      .catch(console.error)
  }
  
  static create(data) {
    return this.adapter.post(data)
      .then(json => new User(json))
      .catch(console.error)
  }

  static init() {
    User.adapter = new RailsAPIAdapter(`http://localhost:3000/api/v1/rooms/${Room.current.id}/users`)
    return this.populateFromAPI()
  }
}

User.all = []