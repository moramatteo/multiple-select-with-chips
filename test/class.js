class select {
  //method to call the function without putting the select_name as a parameter

  constructor(querySelector, data, config) {
    this.select_name = querySelector;
    select_constructor(this.select_name, data, config);
  }

  create_chips(data) {
    create_chips(this.select_name, data);
  }

  create_options(data) {
    create_options(this.select_name, data);
  }

  new_data(data, mod) {
    new_datas(this.select_name, data, mod);
  }

  get_value() {
    get_value(this.select_name);
  }

  check_all_selected() {
    check_all_selected(this.select_name);
  }

  select_all() {
    select_all(this.select_name);
  }

  deselect_all(forced) {
    deselect_all(this.select_name, forced);
  }
}
