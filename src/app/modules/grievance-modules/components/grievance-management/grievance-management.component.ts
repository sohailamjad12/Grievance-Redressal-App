import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { TableColumn, GrievancesTableData } from '../../../../interfaces/interfaces';
import { Tabs } from 'src/app/shared/config';
import { AuthService } from 'src/app/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BreadcrumbItem, ConfigService } from 'src/app/shared';
import { GrievanceServiceService } from '../../services/grievance-service.service';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';


@Component({
  selector: 'app-grievance-management',
  templateUrl: './grievance-management.component.html',
  styleUrls: ['./grievance-management.component.scss']
})
export class GrievanceManagementComponent  {
  grievances: GrievancesTableData[] = [];
  grievancesTableColumns: TableColumn[] = [];
  isDataLoading : boolean = false;
  userRole: string;
  tabs: any[] = [];
  selectedTab:any=null;
  responseLength: number;
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'Grievance List', url: 'grievance/manage-tickets' },
  ];
  getGrievancesRequest = {};
  constructor( 
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService,
    private grievanceService: GrievanceServiceService,
    private toastrService:ToastrServiceService ){
    }

  pageIndex = 0;
  pageLength = 0;
  pageSize = 0;

  ngOnInit(): void {
    this.userRole = this.authService.getUserRoles()[0];
    this.initializeTabs();
    // this.getTicketsRequestObject();
  }

  initializeTabs(): void {
    const Roles = this.configService.rolesConfig.ROLES
    switch(this.userRole ){
      case Roles.NODAL_OFFICER:
        this.tabs = Tabs['Nodal Officer'];
        this.selectedTab =this.tabs[0].name;
        break;
      case Roles.SECRETARY:
        this.tabs = Tabs['Secretary'];
        this.selectedTab =this.tabs[0].name;
        break;
      case Roles.GRIEVANCE_NODAL:
        this.tabs = Tabs['Grievance Nodal'];
        break;
    }
    //Initialize column as per user Role
    this.initializeColumns();
    //Fetch grievances as per user  role
    this.getTicketsRequestObject();
  }

  initializeColumns(): void {
    this.grievancesTableColumns = [
      {
        columnDef: 'ticketId',
        header: 'ID',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['ticketId']}`
      },
      {
        columnDef: 'grievanceRaiser',
        header: 'Grievance Raiser',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['firstName'] + ' ' + element['lastName']}`
      },
      {
        columnDef: 'requesterType',
        header: 'User Type',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['requesterType']}`
      },
      {
        columnDef: 'assignedToName',
        header: 'Raiser Type',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['assignedToName']}`
      },
      {
        columnDef: 'createdDate',
        header: 'Creation Time',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['createdDate']}`
      },
      {
        columnDef: 'escalatedDate',
        header: 'Escalation time',
        isSortable: true,
        cell: (element: Record<string, any>) => `${element['escalatedDate']}`
      },
      {
        columnDef: 'isLink',
        header: '',
        isSortable: false,
        isLink: true,
        cell: (element: Record<string, any>) => `View Ticket`
      }

    ];
  }

  // getgrievances() {
  //   this.isDataLoading = true;
  //   setTimeout(() => {
  //     this.isDataLoading = false;
  //   }, 2000);
  //   // this.grievances = [
  //   //   {
  //   //     id: "340",
  //   //     grievanceRaiser: 'Kalpana Shrivastav',
  //   //     userType:'Institue',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Affiliation',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description.This is a lorem ipsum description which is pretty much large enough to test a description",
  //   //     attachedDocs:["Doc 1","Doc2"]
  //   //   },
  //   //   {
  //   //     id: "327",
  //   //     grievanceRaiser: 'Devpratap Nagendra',
  //   //     userType:'Candiadate',
  //   //     raiserType:'Others',
  //   //     status:"Not-Assigned",
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description",
  //   //     attachedDocs:["Doc 1","Doc2"]
  //   //   },
  //   //   {
  //   //     id: "336",
  //   //     grievanceRaiser: 'Mani Charri',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "335",
  //   //     grievanceRaiser: 'Geethesh Misra',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "334",
  //   //     grievanceRaiser: 'Vinodini Vaishnav',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "333",
  //   //     grievanceRaiser: 'Apporva Nautiyal',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "332",
  //   //     grievanceRaiser: 'Nancy Jain',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "331",
  //   //     grievanceRaiser: 'Deepak Sharma',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "330",
  //   //     grievanceRaiser: 'Usha Singh',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "27",
  //   //     grievanceRaiser: 'Kamlesh Pandey',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
     
  //   //   },
  //   //   {
  //   //     id: "317",
  //   //     grievanceRaiser: 'Pappiya Mukherjee',
  //   //     userType:'Candiadate',
  //   //     status:"Not-Assigned",
  //   //     raiserType:'Others',
  //   //     creationTime: "23-06-2023",
  //   //     escalationTime: "23-12-2023",
  //   //     description: "This is a lorem ipsum description which is pretty much large enough to test a description"
  //   //   }
     
  //   // ]; 
  // }

  onTabChange(event: MatTabChangeEvent): void {
    // Here  we  have userrole and tab index with these 2 we know we need to fetch data for which tab of which user role so we pass relevant payload in get grievance service
    const selectedIndex = event.index;
    this.selectedTab = this.tabs[selectedIndex].name;
    // this.getgrievances();
    this.getTicketsRequestObject();
  }

  onClickItem(e: any) {
    console.log(e?.ticketId)
    e.tabName= this.selectedTab
    let id = parseInt(e?.ticketId)
    this.router.navigate(['/grievance/'+ id], {state: {data: e}});
    // this.router.navigate(['/grievance',  2 ]);
   // this.router.navigate(['/grievance', e.id]);
  }

  getTicketsRequestObject() {
    this.getGrievancesRequest = {
      "searchKeyword":"",
      filter: {
        "status": [], 
        "cc":'' //pass id
       },
      "date": "",
      // "isJunk": true,
      // "priority": "HIGH, MEDIUM, LOW",
      "offset": this.pageIndex,
      "size": 1,
      "sort":{
           "createdTimeTS": "asc"
      }
    }
     this.userRole
    switch(this.selectedTab) {
      case 'Pending': 
        this.getGrievancesRequest = {
          ...this.getGrievancesRequest,
          filter:{
            status:['Open'],
            cc: this.userRole === 'Nodal Officer' ? 'UserID': ''
          }
        }
        break;
      case 'Resolved': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['Closed'],
          cc: this.userRole === 'Nodal Officer' ? 'UserID': ''
        }
      }
      break;
      // this is failing
      case 'Priority': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['Open'],
          cc: this.userRole === 'Nodal Officer' ? 'UserID': ''
        },
        "priority": "HIGH"
      }
      break;
      case 'Escalated to me': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['Open'],
          cc: ''
        },
        "priority": "MEDIUM"
      }
      break;
      case 'Not Assigned':
        this.getGrievancesRequest = {
          ...this.getGrievancesRequest,
          filter:{
            status:['Open'],
            cc: ''
          },
        }
      break;
      case 'Junk': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['Closed'],
          cc: ''
        },
        "isJunk": true
      }
      break;
      default: 
      this.getGrievancesRequest
      break;
    }
    this.getAllTickets();
  }

  /** integration */
  getAllTickets() {
    this.isDataLoading = true;
    this.grievanceService.getAllTickets(this.getGrievancesRequest).subscribe({
      next: (res) => {
        this.isDataLoading = false;
        console.log("response ===>, res", res);
        this.responseLength = res.body.count;
        this.grievances = res.body.data;
      },
      error: (err) => {
        // Handle the error here in case of Api failure
        this.toastrService.showToastr(err, 'Error', 'error', '');
      }
    })
    
  }

  handlePageChange(event: any) {
    console.log(event);
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.pageLength = event.length;

      // call API here
  }

}
