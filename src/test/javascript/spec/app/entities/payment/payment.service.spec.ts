/* tslint:disable max-line-length */
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { PaymentService } from 'app/entities/payment/payment.service';
import { IPayment, Payment, PlanType } from 'app/shared/model/payment.model';

describe('Service Tests', () => {
    describe('Payment Service', () => {
        let injector: TestBed;
        let service: PaymentService;
        let httpMock: HttpTestingController;
        let elemDefault: IPayment;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(PaymentService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Payment(0, currentDate, 0, PlanType.FREE, false, currentDate, 'AAAAAAA', false, 'AAAAAAA', 'AAAAAAA');
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        subscriptionDate: currentDate.format(DATE_FORMAT),
                        validUntil: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Payment', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        subscriptionDate: currentDate.format(DATE_FORMAT),
                        validUntil: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        subscriptionDate: currentDate,
                        validUntil: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Payment(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Payment', async () => {
                const returnedFromService = Object.assign(
                    {
                        subscriptionDate: currentDate.format(DATE_FORMAT),
                        price: 1,
                        planType: 'BBBBBB',
                        paid: true,
                        validUntil: currentDate.format(DATE_FORMAT),
                        lastPaymentId: 'BBBBBB',
                        recurring: true,
                        billingPlanId: 'BBBBBB',
                        tokenRecurring: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        subscriptionDate: currentDate,
                        validUntil: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Payment', async () => {
                const returnedFromService = Object.assign(
                    {
                        subscriptionDate: currentDate.format(DATE_FORMAT),
                        price: 1,
                        planType: 'BBBBBB',
                        paid: true,
                        validUntil: currentDate.format(DATE_FORMAT),
                        lastPaymentId: 'BBBBBB',
                        recurring: true,
                        billingPlanId: 'BBBBBB',
                        tokenRecurring: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        subscriptionDate: currentDate,
                        validUntil: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Payment', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
