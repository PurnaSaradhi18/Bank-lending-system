#include <bits/stdc++.h>
using namespace std;

struct Element {
    pair<int,int> pos;
    vector<int> values;
};

bool shouldMerge(Element &a, Element &b) {
    int overlap = min(a.pos.second, b.pos.second) - max(a.pos.first, b.pos.first);
    if (overlap <= 0) return false;

    int lenA = a.pos.second - a.pos.first;
    int lenB = b.pos.second - b.pos.first;

    return (overlap > lenA/2) || (overlap > lenB/2);
}

vector<Element> combineLists(vector<Element> list1, vector<Element> list2) {
    vector<Element> combined = list1;
    combined.insert(combined.end(), list2.begin(), list2.end());

    sort(combined.begin(), combined.end(), [](Element &a, Element &b){
        return a.pos.first < b.pos.first;
    });

    vector<Element> result;
    for (auto &cur : combined) {
        if (!result.empty() && shouldMerge(result.back(), cur)) {
            result.back().values.insert(result.back().values.end(), cur.values.begin(), cur.values.end());
        } else {
            result.push_back(cur);
        }
    }
    return result;
}

int main() {
    vector<Element> list1 = {
        {{0, 5}, {1, 2}},
        {{6, 10}, {3}}
    };

    vector<Element> list2 = {
        {{4, 8}, {7}},
        {{10, 15}, {8, 9}}
    };

    vector<Element> result = combineLists(list1, list2);

    for (auto &e : result) {
        cout << "Positions: [" << e.pos.first << ", " << e.pos.second << "] Values: ";
        for (int v : e.values) cout << v << " ";
        cout << endl;
    }
}
