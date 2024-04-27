import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PagesService, Reports } from '../../services/pages.service';


@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './logistics.component.html',
  styleUrl: './logistics.component.css'
})
export class LogisticsComponent {
  private pagesService = inject(PagesService);
  private modalService = inject(NgbModal);
  private toolsForm = inject(FormBuilder);
  private notifycation = inject(ToastrService)

  productFound: boolean = false;

  listDeReportes: Reports[] = [];
  listFiltrados: Reports[] = [];

  filtroReporte: string = '';
  
  startDate: string = '';
  endDate: string = '';

  formStock = this.toolsForm.group({
    'code_product': ['', [Validators.required]],
    'lot': ['', [Validators.required]],
    'details': ['', [Validators.required]]
  })

  @ViewChild('addModalAddStock') addModalAddStock?: ElementRef<any>;
  @ViewChild('addModalRemoveStock') addModalRemoveStock?: ElementRef<any>;

  ngOnInit(): void {
    this.showReports();
    this.listFiltrados = [...this.listDeReportes]
  }

  modalAddStock() {
    this.modalService.open(this.addModalAddStock, {centered: true})
  }

  modalRemoveStock() {
    console.log('Add product');
    this.modalService.open(this.addModalRemoveStock, {centered: true})
  }

  searchProduct() {
    const codeProduct = this.formStock.value.code_product;
    if (codeProduct) {
      this.pagesService.searchProduct(codeProduct).subscribe((existenceCheck) => 
        {
          this.productFound = existenceCheck.existente;
          if (this.productFound) {
            this.formStock.get('code_product')?.disable();
            this.notifycation.success(`Producto encontrado.`, 'Éxito')
          }
        }, (error) => {
          this.notifycation.error('Producto no encontrado', 'Error'); 
        }
      );
    } else {
      console.error('Código de producto no válido');
    }
  }

  saveAddStock() {
    if (this.formStock.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error'); 
      return;
    }

    this.pagesService.addStock({
      movement_type: 'Ingreso',
      code_product: this.formStock.get('code_product')?.value ?? '',
      lot: Number(this.formStock.get('lot')?.value) ?? '',
      details: this.formStock.get('details')?.value ?? '',
    }).subscribe({
      next: (value)=>{
        console.log(value),
        this.notifycation.success(`Se ha agregado el ingreso de stock correctamente.`, 'Éxito')
        this.formStock.reset();
        this.formStock.get('code_product')?.enable();
        this.productFound = false;
        this.showReports();
      },
      error: (err) => {
        if (err.status === 404) {
          this.notifycation.error('Producto no encontrado.', 'Error',)
        }
        else {
          this.notifycation.error(err.message, 'Error');
        }
      }
    })
  }

  saveRemoveStock() {
    if (this.formStock.invalid) {
      this.notifycation.error('Debes completar todos los campos correctamente', 'Error'); 
      return;
    }

    this.pagesService.removeStock({
      movement_type: 'Salida',
      code_product: this.formStock.get('code_product')?.value ?? '',
      lot: Number(this.formStock.get('lot')?.value) ?? '',
      details: this.formStock.get('details')?.value ?? '',
    }).subscribe({
      next: (value)=>{
        console.log(value),
        this.notifycation.success(`Se ha agregado la salida de stock correctamente.`, 'Éxito')
        this.formStock.reset();
        this.formStock.get('code_product')?.enable();
        this.productFound = false;
        this.showReports();
      },
      error: (err) => {
        if (err.status === 404) {
          this.notifycation.error('Producto no encontrado.', 'Error',)
        }
        else {
          this.notifycation.error(err.message, 'Error');
        }
      }
    })
  }

  cancel() {
    this.formStock.reset();
    this.formStock.get('code_product')?.enable();
    this.productFound = false;
  }

  showReports() {
    this.pagesService.showReports()
    .subscribe(reportes => {
      this.listDeReportes = reportes;
      this.listFiltrados = [...this.listDeReportes];
    })
  }

  //FILTRO PARA TIPO DE MOVIMIENTO
  filterLogType_Movement() {
    if (this.filtroReporte === 'Todos') {
      this.listFiltrados = [...this.listDeReportes];
    } else {
      this.listFiltrados = this.listDeReportes.filter(
        reporte => reporte.movement_type.includes(this.filtroReporte)
      )
    }
  }

  //FILTRO PARA FECHA
  filterLogDate() {
    if (!this.startDate || !this.endDate) {
      this.listFiltrados = this.listDeReportes;
      return;
    }

    const startDateTime = new Date(this.startDate);
    const endDateTime = new Date(this.endDate);

    this.listFiltrados = this.listDeReportes.filter(reporte => {
      const reportDateTime = new Date(reporte.datetime);
      return reportDateTime >= startDateTime && reportDateTime <= endDateTime;
    });
  }
}