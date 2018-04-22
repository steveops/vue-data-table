// http://chaijs.com/api/bdd/
import DataTable from '../../src/DataTable.vue'
import { createLocalVue, shallow } from '@vue/test-utils'
import sinon from 'sinon'

const localVue = createLocalVue()

describe('DataTable.vue', () => {
  it('Mounts correctly with minimal values and renders an empty table', () => {
    let dataTable = shallow(DataTable, {
      attachToDocument: true,
      localVue,
      propsData: {
        dataset: [],
        options: {
          config: {
            search: {
              enabled: false
            },
            sorting: {
              enabled: false
            },
            actionComponent: {
              enabled: false
            },
            filtering: {
              enabled: false
            }
          },
          fields: []
        }
      }
    })

    expect(dataTable.contains('div')).toEqual(true)
    const element = dataTable.find('.no-results')
    expect(element.is('div')).toEqual(true)
    expect(element.text()).toEqual('No Results. Please broaden your search parameters.')
  })

  it('Watches for changes in dataset and config', () => {
    let dataTable = shallow(DataTable, {
      localVue,
      propsData: {
        dataset: [
          {
            'is_active': true,
            'menu_items': [],
            'name': 'xx'
          }
        ],
        options: {
          config: {
            search: {
              enabled: true,
              field: 'name',
              term: null,
              placeholder: 'Search'
            },
            sorting: {
              enabled: false
            },
            filtering: {
              enabled: false
            }
          },
          fields: [
            {
              type: 'text',
              name: 'Name',
              field: 'name',
              header: true,
              sortable: true,
              grow: 2
            },
            {
              type: 'boolean',
              name: 'Status',
              field: 'is_active',
              yes: 'Active',
              no: 'Inactive',
              header: true
            },
            {
              type: 'count',
              name: 'Count',
              field: 'menu_items',
              header: true
            }
          ]
        }
      }
    })

    let processData = sinon.spy(dataTable.vm, 'processData')
    dataTable.setProps({
      dataset: [
        {
          'is_active': false,
          'menu_items': [],
          'name': 'xx'
        },
        {
          'is_active': false,
          'menu_items': [],
          'name': 'xx'
        }
      ]
    })

    expect(processData.called).toEqual(true)
    processData.restore()
  })

  it('it computes showHeaders and processedData', async () => {
    let dataTable = shallow(DataTable, {
      localVue,
      propsData: {
        dataset: [
          {
            'is_active': true,
            'menu_items': [],
            'name': 'xx'
          }
        ],
        options: {
          config: {
            search: {
              enabled: true,
              field: 'name',
              term: null,
              placeholder: 'Search'
            },
            sorting: {
              enabled: false
            },
            filtering: {
              enabled: false
            }
          },
          fields: [
            {
              type: 'text',
              name: 'Name',
              field: 'name',
              header: true,
              sortable: true,
              grow: 2
            },
            {
              type: 'boolean',
              name: 'Status',
              field: 'is_active',
              yes: 'Active',
              no: 'Inactive',
              header: true
            },
            {
              type: 'count',
              name: 'Count',
              field: 'menu_items',
              header: true
            }
          ]
        }
      }
    })

    await dataTable.vm.$nextTick()
    expect(dataTable.vm.showHeaders).toEqual(true)
    expect(dataTable.vm.processedData).toEqual(dataTable.vm.processData())
  })

  it('processes data', () => {
    let dataTable = shallow(DataTable, {
      localVue,
      propsData: {
        dataset: [
          {
            'is_active': true,
            'closed_on': [1, 2],
            'menu_items': [],
            'name': 'yyy',
            'created': '10-12-1992',
            'updated': '14-12-1992',
            'required': 15,
            'supplied': 10,
            'address': {'place': 'abc'}
          },
          {
            'is_active': true,
            'closed_on': [1, 2, 3],
            'menu_items': [],
            'name': 'xxx',
            'created': '10-12-1992',
            'updated': '14-12-1992',
            'required': 15,
            'supplied': 10,
            'address': {'place': 'fgh'}
          },
          {
            'is_active': true,
            'closed_on': [1, 2, 3, 4],
            'menu_items': [],
            'name': 'xxxx',
            'created': '10-12-1992',
            'updated': '14-12-1992',
            'required': 15,
            'supplied': 10,
            'address': {'place': 'cde'}
          }
        ],
        options: {
          config: {
            search: {
              enabled: true,
              field: 'name',
              term: 'x',
              placeholder: 'Search'
            },
            sorting: {
              enabled: true,
              field: 'address.place'
            },
            filtering: {
              enabled: true,
              filters: [
                {
                  enabled: true,
                  field: 'is_active',
                  value: true,
                  type: 'checkbox',
                  collection: false
                },
                {
                  enabled: true,
                  field: 'closed_on',
                  value: true,
                  type: 'checkbox',
                  collection: true
                },
                {
                  enabled: true,
                  field: 'name',
                  value: 'xx',
                  type: 'dropdown'
                },
                {
                  enabled: true,
                  field: 'menu_items',
                  type: 'tabbed',
                  tabbs: [
                    {
                      type: 'date',
                      field: 'created',
                      from: '11-12-1992',
                      to: '14-12-1992'
                    },
                    {
                      type: 'date',
                      field: 'updated',
                      from: '11-12-1992',
                      to: '13-12-1992'
                    },
                    {
                      type: 'range',
                      field: 'supplied',
                      from: 11,
                      to: 14
                    },
                    {
                      type: 'range',
                      field: 'required',
                      from: 11,
                      to: 14
                    }
                  ]
                }
              ]
            }
          },
          fields: [
            {
              type: 'boolean',
              name: 'Status',
              field: 'is_active',
              yes: 'Active',
              no: 'Inactive',
              header: true
            },
            {
              type: 'count',
              name: 'Closed',
              field: 'closed_on',
              header: true
            },
            {
              type: 'count',
              name: 'Menus',
              field: 'menu_items',
              header: true
            },
            {
              type: 'text',
              name: 'Name',
              field: 'name',
              header: true,
              sortable: true,
              grow: 2
            },
            {
              name: 'Created',
              type: 'date',
              field: 'created',
              header: true
            },
            {
              name: 'Updated',
              type: 'date',
              field: 'updated',
              header: true
            },
            {
              name: 'Required',
              type: 'number',
              field: 'required',
              header: true
            },
            {
              name: 'Supplied',
              type: 'number',
              field: 'supplied',
              header: true
            },
            {
              name: 'Address',
              type: 'property',
              field: 'address'
            }
          ]
        }
      }
    })

    let data = dataTable.vm.processData()
    expect(typeof data).toEqual('object')
  })

  it('gets style', () => {
    let dataTable = shallow(DataTable, {
      localVue,
      propsData: {
        dataset: [
          {
            'is_active': true,
            'menu_items': [],
            'name': 'xx'
          }
        ],
        options: {
          config: {
            search: {
              enabled: true,
              field: 'name',
              term: null,
              placeholder: 'Search'
            },
            sorting: {
              enabled: false
            },
            filtering: {
              enabled: false
            }
          },
          fields: [
            {
              type: 'text',
              name: 'Name',
              field: 'name',
              header: true,
              sortable: true,
              grow: 2
            },
            {
              type: 'boolean',
              name: 'Status',
              field: 'is_active',
              yes: 'Active',
              no: 'Inactive',
              header: true
            },
            {
              type: 'count',
              name: 'Count',
              field: 'menu_items',
              header: true
            }
          ]
        }
      }
    })

    expect(dataTable.vm.getStyle({grow: 1})).toEqual('flex: 1')
    expect(dataTable.vm.getStyle({type: 'image'})).toEqual('flex: 0; min-width: 50px;')
    expect(dataTable.vm.getStyle({type: 'component'})).toEqual('flex: 0; padding-right: 1em;')
    expect(dataTable.vm.getStyle({type: 'text'})).toEqual('flex: 1')
  })
})
