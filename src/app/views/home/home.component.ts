import { WorkShifts } from './../../model/work-shifts';
import { MatTable } from '@angular/material/table';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { ConnectionShift } from 'src/app/connections/connection-shift';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>
  displayedColumns: string[] = ['Nome', 'Valor', 'Hora Inicial', 'Hora Final', 'Ações'];
  dataSource!: Array<WorkShifts>

  constructor(public dialog: MatDialog,private http:HttpClient) {}

  ngOnInit(): void {
    this.listShifts();
  }

  // Ação ao abrir modal
  openDialog(element: WorkShifts | null):void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: element === null ? {nome: '', valor:null, horaInicial:'', horaFinal:''} : element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) { 
        if (!result.id) {
          this.addShift(result)
        } else {
          this.editShift(result)
        }
      }
    });
  }
  // Busca todos os turnos cadastrados
  listShifts():void {
    this.http.get<any>(ConnectionShift.url + '?active=true').subscribe(result=>{
      this.dataSource = result.work_shifts;
    });
  }
  // Adiciona um turno
  addShift(data: WorkShifts):void {
    this.http.post(ConnectionShift.url, data).subscribe(result => {
      alert("Turno cadastrado com sucesso!")
      this.listShifts()
    });
  }
  // Edita um turno
  editShift(element: WorkShifts):void {
    this.http.put(`${ConnectionShift.url}/${element.id}`, element).subscribe(result => {
      this.listShifts()
    });
  }
  // Exclui um turno
  deleteShift(element: WorkShifts):void {
    if (confirm(`Deseja realmente excluir o turno ${element.name}?`)) {
      this.http.delete(`${ConnectionShift.url}/${element.id}`).subscribe(result => {
        alert("Turno deletado com sucesso!")
        this.listShifts()
      });
    }
  }
  // Aciona modal de edição
  editElement(element: WorkShifts):void {
    this.openDialog(element)
  }

}
