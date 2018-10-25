import { Component, OnInit } from "@angular/core";
import { NGXLogger } from "ngx-logger";

// 引入服务
import { NetworkService } from "../../services/network.service";
import { ProfileService } from "../../services/profile.service";

import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  balance: any = 0;
  balanceDot: any = null;
  loginDate: {
    pubkey: string;
  };

  constructor(
    private logger: NGXLogger,
    private network: NetworkService,
    private ProfileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.logger.debug("homepage");
    //this.logger.debug("钱包的地址是：", this.ProfileService.wallet.address);
    // this.logger.debug(this.ProfileService.wallet.addressPubkey);
    this.loginDate = { pubkey: this.ProfileService.wallet.pubkey };
    var address = this.ProfileService.wallet.address;

    this.network.getBalance(address).subscribe(res => {
      var strBalance = (res.data.stable / 1000000).toString();
      var dotNum = strBalance.indexOf(".");
      if (dotNum == -1) {
        this.balance = strBalance.replace(/(\d{1,3})(?=(\d{3})+$)/g, "$1,");
        this.balanceDot = ".00";
      } else {
        this.balance = strBalance
          .substr(0, dotNum)
          .replace(/(\d{1,3})(?=(\d{3})+$)/g, "$1,");
        this.balanceDot = strBalance.substr(dotNum, 3);
      }
      //console.log(this.balance, this.balanceDot);
    });

    // 登录注册
    this.logger.info("ionViewDidLoad Home---------");
    this.network.login(this.loginDate).subscribe(response => {
      this.logger.info(response);
    });
  }

  // 点击进入 账单
  goAccount(){
    this.router.navigate(["/account"]);
  }
}
