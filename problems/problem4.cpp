#include <bits/stdc++.h>
using namespace std;

struct Result {
    int buyYear;
    int sellYear;
    int loss;
};

Result minimizeLoss(vector<int> &price) {
    int n = price.size();
    map<int,int> seen; 
    int minLoss = INT_MAX, buyYear=-1, sellYear=-1;
    for (int i = n-1; i >= 0; i--) {
        auto it = seen.upper_bound(price[i]);
        if (it != seen.end()) {
            int loss = it->first - price[i];
            if (loss < minLoss) {
                minLoss = loss;
                buyYear = it->second + 1; 
                sellYear = i + 1;
            }
        }
        seen[price[i]] = i;
    }

    return {buyYear, sellYear, minLoss};
}

int main() {
    int n;
    cout << "Enter number of years: ";
    cin >> n;

    vector<int> price(n);
    cout << "Enter prices: ";
    for (int i = 0; i < n; i++) cin >> price[i];

    Result ans = minimizeLoss(price);

    cout << "Buy in Year " << ans.buyYear
         << ", Sell in Year " << ans.sellYear
         << ", Minimum Loss = " << ans.loss << endl;

    return 0;
}
